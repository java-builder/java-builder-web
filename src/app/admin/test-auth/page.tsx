'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function TestAuthPage() {
    const { isAuthenticated, hasAdminAccess, userScopes, isLoading, error, checkAuth } = useAuth();

    return (
        <div className="p-6">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Test Authentication</h1>

                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Authentication Status</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-2">Authentication State</h3>
                            <p className={`text-sm ${isAuthenticated ? 'text-green-600' : 'text-red-600'}`}>
                                {isLoading ? 'Loading...' : isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-2">Admin Access</h3>
                            <p className={`text-sm ${hasAdminAccess ? 'text-green-600' : 'text-red-600'}`}>
                                {isLoading ? 'Loading...' : hasAdminAccess ? 'Has Admin Access' : 'No Admin Access'}
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-2">User Scopes</h3>
                            <p className="text-sm text-gray-600">
                                {isLoading ? 'Loading...' : userScopes.length > 0 ? userScopes.join(', ') : 'No scopes'}
                            </p>
                        </div>

                        <div className="p-4 border rounded-lg">
                            <h3 className="font-medium text-gray-700 mb-2">Error</h3>
                            <p className={`text-sm ${error ? 'text-red-600' : 'text-gray-600'}`}>
                                {error || 'No errors'}
                            </p>
                        </div>
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={checkAuth}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                        >
                            Refresh Auth Status
                        </button>
                    </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-900 mb-2">How it works:</h3>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• This page is protected by ProtectedRoute with requireAdmin=true</li>
                        <li>• The system calls /api/v1/auth/introspect to check your token</li>
                        <li>• If valid=true and scopes contains &quot;ADMIN&quot;, you can access this page</li>
                        <li>• Otherwise, you&apos;ll see an &quot;Unauthorized&quot; modal</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
