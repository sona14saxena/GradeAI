"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrainCircuit, Loader2, KeyRound, User, Mail, Building2 } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

export default function LoginPage() {
    const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
    const [name, setName] = useState('');
    const [facultyId, setFacultyId] = useState('');
    const [email, setEmail] = useState('');
    const [institute, setInstitute] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const endpoint = activeTab === 'signin' ? '/auth/faculty/login' : '/auth/faculty/signup';
        const body = activeTab === 'signin' 
            ? { name, faculty_id: facultyId }
            : { name, faculty_id: facultyId, email, institute };

        try {
            const res = await fetch(`${API_BASE_URL}${endpoint}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.detail || "Authentication failed");
            }

            localStorage.setItem("facultyAuth", JSON.stringify(data));
            router.push("/dashboard");

        } catch (err: any) {
            console.error("Auth error:", err);
            setError(err.message || "An error occurred during authentication. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        if (!credentialResponse.credential) return;
        
        setError(null);
        setLoading(true);
        
        try {
            const decoded: any = jwtDecode(credentialResponse.credential);
            
            const res = await fetch(`${API_BASE_URL}/auth/faculty/google`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture
                }),
            });
            
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.detail || "Google authentication failed");
            }
            
            localStorage.setItem("facultyAuth", JSON.stringify(data));
            router.push("/dashboard");
            
        } catch (err: any) {
            console.error("Google Auth error:", err);
            setError(err.message || "An error occurred during Google authentication.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
            <main className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-background to-secondary/20 overflow-hidden relative">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] -z-10 animate-pulse transition-all duration-1000"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[128px] -z-10 animate-pulse delay-700 transition-all duration-1000"></div>

                <div className="w-full max-w-md z-10">
                    <div className="glass p-8 md:p-10 rounded-2xl shadow-xl border border-border/50 backdrop-blur-xl relative overflow-hidden group">
                        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-400 to-primary"></div>

                        <div className="text-center mb-8">
                            <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                                <BrainCircuit size={32} />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight mb-2 text-foreground">Faculty Portal</h1>
                            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
                                Welcome to the internal faculty portal
                            </p>
                        </div>
                        
                        <div className="flex bg-secondary/50 p-1 rounded-xl mb-6">
                            <button 
                                onClick={() => { setActiveTab('signin'); setError(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'signin' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Sign In
                            </button>
                            <button 
                                onClick={() => { setActiveTab('signup'); setError(null); }}
                                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${activeTab === 'signup' ? 'bg-background shadow text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Sign Up
                            </button>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-xl border border-destructive/20 text-sm font-medium flex items-center gap-2">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleAuth} className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-foreground/90 ml-1">Full Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                        <User size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-foreground/90 ml-1">Faculty ID</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                        <KeyRound size={18} />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={facultyId}
                                        onChange={(e) => setFacultyId(e.target.value)}
                                        className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                        placeholder="Enter your Faculty ID"
                                    />
                                </div>
                            </div>

                            {activeTab === 'signup' && (
                                <>
                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <label className="text-sm font-semibold text-foreground/90 ml-1">Email Address</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                required={activeTab === 'signup'}
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                                placeholder="Enter your email"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300 delay-75">
                                        <label className="text-sm font-semibold text-foreground/90 ml-1">Institute / University</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-muted-foreground">
                                                <Building2 size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                required={activeTab === 'signup'}
                                                value={institute}
                                                onChange={(e) => setInstitute(e.target.value)}
                                                className="w-full pl-10 pr-4 py-3 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                                                placeholder="e.g. MIT, Stanford"
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] font-semibold transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-70 disabled:transform-none flex items-center justify-center gap-2 mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Please wait...
                                    </>
                                ) : (
                                    activeTab === 'signin' ? "Sign In" : "Create Account"
                                )}
                            </button>
                            
                            <div className="relative flex py-2 items-center">
                                <div className="flex-grow border-t border-border/50"></div>
                                <span className="flex-shrink-0 mx-4 text-muted-foreground text-xs uppercase tracking-wider font-medium">Or continue with</span>
                                <div className="flex-grow border-t border-border/50"></div>
                            </div>
                            
                            <div className="flex justify-center mt-2 overflow-hidden px-1">
                                <GoogleLogin 
                                    onSuccess={handleGoogleSuccess}
                                    onError={() => setError("Google Login Failed")}
                                    useOneTap
                                    shape="rectangular"
                                    size="large"
                                    theme="outline"
                                    logo_alignment="center"
                                />
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </GoogleOAuthProvider>
    );
}
