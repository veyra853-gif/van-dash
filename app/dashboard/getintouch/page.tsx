"use client";

import { useEffect, useState } from "react";

interface GetInTouchRecord {
    id: string;
    locationTitle: string;
    locationDescription: string;
    phoneTitle: string;
    phoneDescription: string;
    emailTitle: string;
    emailDescription: string;
}

export default function GetInTouchManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [recordId, setRecordId] = useState<string | null>(null);
    const [locationTitle, setLocationTitle] = useState("");
    const [locationDescription, setLocationDescription] = useState("");
    const [phoneTitle, setPhoneTitle] = useState("");
    const [phoneDescription, setPhoneDescription] = useState("");
    const [emailTitle, setEmailTitle] = useState("");
    const [emailDescription, setEmailDescription] = useState("");

    const fetchGetInTouch = async () => {
        try {
            const res = await fetch("/api/getintouch");
            const json = await res.json();
            if (json.success) {
                const first: GetInTouchRecord | undefined = (json.data || [])[0];
                if (first?.id) {
                    setRecordId(first.id);
                    setLocationTitle(first.locationTitle || "");
                    setLocationDescription(first.locationDescription || "");
                    setPhoneTitle(first.phoneTitle || "");
                    setPhoneDescription(first.phoneDescription || "");
                    setEmailTitle(first.emailTitle || "");
                    setEmailDescription(first.emailDescription || "");
                } else {
                    setRecordId(null);
                }
            }
        } catch (e) {
            console.error("Error fetching GetInTouch:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGetInTouch();
    }, []);

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                locationTitle,
                locationDescription,
                phoneTitle,
                phoneDescription,
                emailTitle,
                emailDescription,
            };

            const res = await fetch(
                recordId ? `/api/getintouch/${recordId}` : "/api/getintouch",
                {
                    method: recordId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const json = await res.json();
            if (!json.success) throw new Error(json.error || "Failed to save GetInTouch");

            if (!recordId && json?.data?.id) setRecordId(json.data.id);

            alert("GetInTouch saved successfully!");
        } catch (e) {
            console.error("Error saving GetInTouch:", e);
            alert("Error saving GetInTouch");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!recordId) return;
        if (!confirm("Are you sure you want to delete the GetInTouch content?")) return;
        try {
            const res = await fetch(`/api/getintouch/${recordId}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || "Failed to delete GetInTouch");

            setRecordId(null);
            setLocationTitle("");
            setLocationDescription("");
            setPhoneTitle("");
            setPhoneDescription("");
            setEmailTitle("");
            setEmailDescription("");

            alert("GetInTouch deleted successfully!");
        } catch (e) {
            console.error("Error deleting GetInTouch:", e);
            alert("Error deleting GetInTouch");
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-64 mb-6" />
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="bg-gray-300 rounded-lg h-32" />
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Get In Touch Management</h1>
                    <p className="text-gray-600">Manage contact information (location, phone, email)</p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8 space-y-5">
                <h2 className="text-xl font-semibold text-gray-800 border-b pb-3">Contact Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Location</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                value={locationTitle}
                                onChange={(e) => setLocationTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Location title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={locationDescription}
                                onChange={(e) => setLocationDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Location description"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Phone</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                value={phoneTitle}
                                onChange={(e) => setPhoneTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Phone title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={phoneDescription}
                                onChange={(e) => setPhoneDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Phone numbers"
                            />
                        </div>
                    </div>

                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Email</h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                            <input
                                value={emailTitle}
                                onChange={(e) => setEmailTitle(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Email title"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                                value={emailDescription}
                                onChange={(e) => setEmailDescription(e.target.value)}
                                className="w-full border border-gray-300 rounded-md p-2.5 min-h-[80px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                                placeholder="Email addresses"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 text-white px-8 py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-60 font-medium transition"
                >
                    {saving ? "Saving..." : recordId ? "Update Get In Touch" : "Create Get In Touch"}
                </button>

                {recordId && (
                    <button
                        onClick={handleDelete}
                        className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
                    >
                        Delete Get In Touch
                    </button>
                )}
            </div>

            {!recordId && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                        No GetInTouch record yet — fill the form and click “Create Get In Touch”.
                    </p>
                </div>
            )}
        </div>
    );
}
