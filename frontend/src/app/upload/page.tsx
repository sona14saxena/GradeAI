"use client";

import { useState } from 'react';
import { UploadCloud, FileType, CheckCircle2, UserCircle2 } from 'lucide-react';

export default function UploadPage() {
    // Teacher Details
    const [teacherId, setTeacherId] = useState("");
    const [courseCode, setCourseCode] = useState("");
    const [subjectName, setSubjectName] = useState("");



    // File Details
    const [modelAnswer, setModelAnswer] = useState<File | null>(null);
    const [studentFiles, setStudentFiles] = useState<FileList | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modelAnswer || !studentFiles || !teacherId || !courseCode || !subjectName) {
            alert("Please fill in all teacher details and upload the required files.");
            return;
        }

        setIsUploading(true);
        try {
            // 1. Upload Model Answer with Context
            const modelFormData = new FormData();
            modelFormData.append("subject", subjectName);
            modelFormData.append("exam_type", courseCode);
            modelFormData.append("file", modelAnswer);

            const modelRes = await fetch(`${API_BASE_URL}/uploads/model-answer`, {
                method: "POST",
                body: modelFormData,
            });

            if (!modelRes.ok) throw new Error("Failed to upload model answer");
            const modelData = await modelRes.json();
            const modelAnswerId = modelData.model_answer_id;

            // 2. Upload Student Notebooks
            const studentFormData = new FormData();
            studentFormData.append("model_answer_id", modelAnswerId);
            for (let i = 0; i < studentFiles.length; i++) {
                studentFormData.append("files", studentFiles[i]);
            }

            const studentRes = await fetch(`${API_BASE_URL}/uploads/student-notebooks`, {
                method: "POST",
                body: studentFormData,
            });

            if (!studentRes.ok) throw new Error("Failed to upload student files");
            const studentData = await studentRes.json();
            const studentIds = studentData.student_ids;

            // 3. Trigger Evaluation
            for (const studentId of studentIds) {
                await fetch(`${API_BASE_URL}/evaluations/evaluate/${studentId}`, {
                    method: "POST",
                });
            }

            // Save context for dashboard
            localStorage.setItem("current_model_answer_id", modelAnswerId);
            localStorage.setItem("teacher_context", JSON.stringify({ teacherId, courseCode, subjectName }));

            setIsUploading(false);
            alert('Upload & evaluation initialized successfully!');
            window.location.href = '/dashboard';
        } catch (error) {
            console.error("Upload error:", error);
            alert("Error communicating with Evaluation Core. Please verify connection and try again.");
            setIsUploading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] bg-background flex items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[128px] -z-10 pointer-events-none"></div>

            <div className="max-w-3xl mx-auto w-full glass p-8 rounded-2xl shadow-2xl border border-border/50 relative z-10">
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4 glow-box">
                        <UploadCloud size={32} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Configure Evaluation Task</h1>
                    <p className="text-muted-foreground mt-2 font-light">Supply initialization parameters and datasets.</p>
                </div>

                <form onSubmit={handleUpload} className="space-y-8">

                    {/* Section 1: Teacher Config */}
                    <div className="space-y-4 p-6 bg-secondary/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-4 text-foreground font-semibold border-b border-border/50 pb-2">
                            <UserCircle2 size={20} className="text-primary" />
                            <span>1. Instructor Configuration</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Teacher ID</label>
                                <input
                                    type="text"
                                    value={teacherId}
                                    onChange={(e) => setTeacherId(e.target.value)}
                                    placeholder="e.g. TCH-8902"
                                    required
                                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Course Code</label>
                                <input
                                    type="text"
                                    value={courseCode}
                                    onChange={(e) => setCourseCode(e.target.value)}
                                    placeholder="e.g. CS101"
                                    required
                                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Subject Name</label>
                                <input
                                    type="text"
                                    value={subjectName}
                                    onChange={(e) => setSubjectName(e.target.value)}
                                    placeholder="Introduction to Computer Science"
                                    required
                                    className="w-full bg-background/50 border border-border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-muted-foreground/50"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Data Ingestion */}
                    <div className="space-y-6 p-6 bg-secondary/30 rounded-xl border border-border">
                        <div className="flex items-center gap-2 mb-2 text-foreground font-semibold border-b border-border/50 pb-2">
                            <FileType size={20} className="text-primary" />
                            <span>2. Document Ingestion</span>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Master Answer Key (PDF Vector)
                            </label>
                            <label className="flex items-center justify-center w-full min-h-[8rem] border-2 border-dashed border-border rounded-xl hover:bg-secondary/50 hover:border-primary/50 cursor-pointer transition-colors">
                                <div className="text-center px-4">
                                    {modelAnswer ? (
                                        <div className="flex flex-col items-center text-primary">
                                            <CheckCircle2 size={32} className="mb-2" />
                                            <span className="text-sm font-medium">{modelAnswer.name}</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-muted-foreground">
                                            <FileType size={32} className="mb-2 opacity-50" />
                                            <span className="text-sm font-medium">Click to select Model Answer PDF</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept=".pdf" className="hidden" required onChange={(e) => setModelAnswer(e.target.files?.[0] || null)} />
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-foreground mb-3">
                                Student Submissions (Batch PDF)
                            </label>
                            <label className="flex items-center justify-center w-full min-h-[8rem] border-2 border-dashed border-border rounded-xl hover:bg-secondary/50 hover:border-primary/50 cursor-pointer transition-colors">
                                <div className="text-center px-4">
                                    {studentFiles && studentFiles.length > 0 ? (
                                        <div className="flex flex-col items-center text-primary">
                                            <CheckCircle2 size={32} className="mb-2" />
                                            <span className="text-sm font-medium">{studentFiles.length} files queued for processing</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center text-muted-foreground">
                                            <UploadCloud size={32} className="mb-2 opacity-50" />
                                            <span className="text-sm font-medium">Click to select Student PDFs</span>
                                        </div>
                                    )}
                                </div>
                                <input type="file" accept=".pdf" multiple className="hidden" required onChange={(e) => setStudentFiles(e.target.files)} />
                            </label>
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={isUploading}
                            className={`w-full flex justify-center py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] text-sm font-bold text-primary-foreground ${isUploading ? 'bg-primary/50 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary focus:ring-offset-background'
                                } transition-all duration-300 transform ${!isUploading && 'hover:-translate-y-1'}`}
                        >
                            {isUploading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Executing Neural Pipeline...
                                </span>
                            ) : 'Initialize Evaluation Sequence'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
