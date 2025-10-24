// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract BloodChain is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant BLOOD_BANK_ROLE = keccak256("BLOOD_BANK_ROLE");
    bytes32 public constant HOSPITAL_ROLE = keccak256("HOSPITAL_ROLE");
    bytes32 public constant DONOR_ROLE = keccak256("DONOR_ROLE");

    uint256 private _unitIdCounter;
    uint256 private _requestIdCounter;

    struct BloodUnit {
        uint256 id;
        address donor;
        string bloodType;
        uint256 quantity;
        uint256 expiryDate; // Unix timestamp
        string ipfsHash; // IPFS hash for additional data (e.g., photo for QR verification)
        address currentOwner; // Blood bank or hospital
        bool used;
    }

    struct Request {
        uint256 id;
        address hospital;
        address bloodBank;
        string bloodType;
        uint256 quantity;
        string status; // "Pending", "Approved", "Rejected", "Fulfilled"
    }

    mapping(uint256 => BloodUnit) public bloodUnits;
    mapping(uint256 => Request) public requests;
    mapping(address => uint256) public donorRewards; // Points for donors

    event RoleGranted(bytes32 indexed role, address indexed account);
    event DonationRecorded(uint256 indexed unitId, address indexed donor, address indexed bloodBank, string bloodType, uint256 quantity, string ipfsHash);
    event RequestCreated(uint256 indexed requestId, address indexed hospital, address bloodBank, string bloodType, uint256 quantity);
    event RequestApproved(uint256 indexed requestId, address indexed bloodBank, uint256[] unitIds);
    event UnitsTransferred(uint256[] indexed unitIds, address indexed from, address indexed to);
    event UnitUsed(uint256 indexed unitId, address indexed hospital);

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        _unitIdCounter = 0;
        _requestIdCounter = 0;
    }

    // Admin grants roles to users (via their wallet addresses)
    function grantRoleToUser(bytes32 role, address user) public onlyRole(ADMIN_ROLE) {
        _grantRole(role, user);
        emit RoleGranted(role, user);
    }

    // Blood Bank records a donation (creates a new blood unit)
    function recordDonation(
        address donor,
        string memory bloodType,
        uint256 quantity,
        string memory ipfsHash,
        uint256 expiryDays
    ) public onlyRole(BLOOD_BANK_ROLE) {
        require(hasRole(DONOR_ROLE, donor), "Address is not a registered donor");
        require(quantity > 0, "Quantity must be positive");
        require(bytes(bloodType).length > 0, "Blood type required");

        _unitIdCounter++;
        uint256 unitId = _unitIdCounter;
        uint256 expiry = block.timestamp + (expiryDays * 1 days);

        bloodUnits[unitId] = BloodUnit({
            id: unitId,
            donor: donor,
            bloodType: bloodType,
            quantity: quantity,
            expiryDate: expiry,
            ipfsHash: ipfsHash,
            currentOwner: msg.sender,
            used: false
        });

        // Reward donor
        donorRewards[donor] += quantity * 10;

        emit DonationRecorded(unitId, donor, msg.sender, bloodType, quantity, ipfsHash);
    }

    // Hospital creates a blood request
    function createRequest(
        address bloodBank,
        string memory bloodType,
        uint256 quantity
    ) public onlyRole(HOSPITAL_ROLE) {
        require(hasRole(BLOOD_BANK_ROLE, bloodBank), "Invalid blood bank address");
        require(quantity > 0, "Quantity must be positive");

        _requestIdCounter++;
        uint256 requestId = _requestIdCounter;

        requests[requestId] = Request({
            id: requestId,
            hospital: msg.sender,
            bloodBank: bloodBank,
            bloodType: bloodType,
            quantity: quantity,
            status: "Pending"
        });

        emit RequestCreated(requestId, msg.sender, bloodBank, bloodType, quantity);
    }

    // Blood Bank approves a request and assigns specific units
    function approveRequest(uint256 requestId, uint256[] memory unitIds) public onlyRole(BLOOD_BANK_ROLE) {
        Request storage req = requests[requestId];
        require(keccak256(bytes(req.status)) == keccak256(bytes("Pending")), "Request not pending");
        require(req.bloodBank == msg.sender, "Not the assigned blood bank");
        require(unitIds.length > 0, "No units provided");

        uint256 totalQuantity = 0;
        for (uint256 i = 0; i < unitIds.length; i++) {
            BloodUnit storage unit = bloodUnits[unitIds[i]];
            require(unit.currentOwner == msg.sender, "Unit not owned by this blood bank");
            require(!unit.used, "Unit already used");
            require(block.timestamp < unit.expiryDate, "Unit expired");
            require(keccak256(bytes(unit.bloodType)) == keccak256(bytes(req.bloodType)), "Blood type mismatch");

            totalQuantity += unit.quantity;
        }
        require(totalQuantity >= req.quantity, "Insufficient quantity in units");

        // Transfer units
        transferUnits(unitIds, req.hospital);

        req.status = "Approved";
        emit RequestApproved(requestId, msg.sender, unitIds);
    }

    // Internal: Transfer units to a new owner (e.g., hospital)
    function transferUnits(uint256[] memory unitIds, address newOwner) internal {
        require(hasRole(HOSPITAL_ROLE, newOwner), "New owner must be a hospital");

        for (uint256 i = 0; i < unitIds.length; i++) {
            BloodUnit storage unit = bloodUnits[unitIds[i]];
            unit.currentOwner = newOwner;
        }

        emit UnitsTransferred(unitIds, msg.sender, newOwner);
    }

    // Hospital marks a unit as used (e.g., allocated to patient)
    function markAsUsed(uint256 unitId) public onlyRole(HOSPITAL_ROLE) {
        BloodUnit storage unit = bloodUnits[unitId];
        require(unit.currentOwner == msg.sender, "Not the owner of this unit");
        require(!unit.used, "Unit already used");
        require(block.timestamp < unit.expiryDate, "Unit expired");

        unit.used = true;
        emit UnitUsed(unitId, msg.sender);
    }

    // View functions for traceability
    function getBloodUnit(uint256 unitId) public view returns (BloodUnit memory) {
        return bloodUnits[unitId];
    }

    function getRequest(uint256 requestId) public view returns (Request memory) {
        return requests[requestId];
    }

    function getDonorRewards(address donor) public view returns (uint256) {
        return donorRewards[donor];
    }
}