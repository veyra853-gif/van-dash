"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface StepsRecord {
    id: string;
    title: string;
    step1Title: string;
    step1Description: string;
    step1Image?: string;
    step2Title: string;
    step2Description: string;
    step2Image?: string;
    step3Title: string;
    step3Description: string;
    step3Image?: string;
    step4Title: string;
    step4Description: string;
    step4Image?: string;
    step5Title?: string;
    step5Description?: string;
    step5Image?: string;
    step6Title?: string;
    step6Description?: string;
    step6Image?: string;
}

export default function StepsManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [recordId, setRecordId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [steps, setSteps] = useState([
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
        { title: "", description: "" },
    ]);

    const fetchSteps = async () => {
        try {
            const res = await fetch("/api/steps");
            const json = await res.json();
            if (json.success) {
                const first: StepsRecord | undefined = (json.data || [])[0];
                if (first?.id) {
                    setRecordId(first.id);
                    setTitle(first.title || "");
                    setSteps([
                        { title: first.step1Title || "", description: first.step1Description || "" },
                        { title: first.step2Title || "", description: first.step2Description || "" },
                        { title: first.step3Title || "", description: first.step3Description || "" },
                        { title: first.step4Title || "", description: first.step4Description || "" },
                    ]);
                } else {
                    setRecordId(null);
                }
            }
        } catch (e) {
            console.error("Error fetching Steps:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSteps();
    }, []);

    const handleStepChange = (index: number, field: "title" | "description", value: string) => {
        const newSteps = [...steps];
        newSteps[index][field] = value;
        setSteps(newSteps);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                title,
                step1Title: steps[0].title,
                step1Description: steps[0].description,
                step2Title: steps[1].title,
                step2Description: steps[1].description,
                step3Title: steps[2].title,
                step3Description: steps[2].description,
                step4Title: steps[3].title,
                step4Description: steps[3].description,
            };

            const res = await fetch(
                recordId ? `/api/steps/${recordId}` : "/api/steps",
                {
                    method: recordId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const json = await res.json();
            if (!json.success) throw new Error(json.error || "Failed to save Steps");

            if (!recordId && json?.data?.id) setRecordId(json.data.id);

            alert("Steps saved successfully!");
        } catch (e) {
            console.error("Error saving Steps:", e);
            alert("Error saving Steps");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!recordId) return;
        if (!confirm("Are you sure you want to delete the Steps content?")) return;
        try {
            const res = await fetch(`/api/steps/${recordId}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || "Failed to delete Steps");

            setRecordId(null);
            setTitle("");
            setSteps(steps.map(() => ({ title: "", description: "" })));

            alert("Steps deleted successfully!");
        } catch (e) {
            console.error("Error deleting Steps:", e);
            alert("Error deleting Steps");
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-64 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="bg-gray-300 rounded-lg h-40" />
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-6xl mx-auto">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Steps Management</h1>
                    <p className="text-gray-600">Manage the Steps section title and 4 steps</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Section Details</h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Section Title</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                        placeholder="Steps section title"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {steps.map((step, index) => (
                        <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Step {index + 1}</h3>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    value={step.title}
                                    onChange={(e) => handleStepChange(index, "title", e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Step title"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={step.description}
                                    onChange={(e) => handleStepChange(index, "description", e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[60px] focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Step description"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
                >
                    {saving ? "Saving..." : recordId ? "Update Steps" : "Create Steps"}
                </button>

                {recordId && (
                    <button
                        onClick={handleDelete}
                        className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
                    >
                        Delete Steps
                    </button>
                )}
            </div>

            {!recordId && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                        No Steps record yet — fill the form and click “Create Steps”.
                    </p>
                </div>
            )}
        </div>
    );
}
