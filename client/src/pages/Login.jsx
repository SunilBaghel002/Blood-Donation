import React from "react";
import { Mail, Lock, LogIn } from "lucide-react";

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-3xl font-bold mb-6 text-center">Log In to BloodChain</h2>
        <form className="space-y-4">
          <div className="flex items-center bg-gray-700 p-3 rounded">
            <Mail className="mr-2 text-gray-400" />
            <input type="email" placeholder="Email or Username" className="bg-transparent outline-none w-full" />
          </div>
          <div className="flex items-center bg-gray-700 p-3 rounded">
            <Lock className="mr-2 text-gray-400" />
            <input type="password" placeholder="Password" className="bg-transparent outline-none w-full" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded font-bold hover:bg-blue-700 transition">
            <LogIn className="inline mr-2" /> Log In
          </button>
        </form>
        <p className="text-center mt-4">
          <a href="/forgot-password" className="text-blue-400 hover:underline">Forgot password?</a>
        </p>
        <div className="mt-6 text-center">
          <p>Or sign in with</p>
          <button className="mt-2 bg-black text-white py-2 px-4 rounded w-full hover:bg-gray-900 transition">Sign in with X</button>
        </div>
        <p className="text-center mt-4">
          New here? <a href="/signup" className="text-blue-400 hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;