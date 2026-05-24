"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Upload from "../../components/Upload";

interface OurServicesRecord {
    id: string;
    title: string;
    card1Title: string;
    card1Description: string;
    card1Image: string;
    card2Title: string;
    card2Description: string;
    card2Image: string;
    card3Title: string;
    card3Description: string;
    card3Image: string;
    card4Title: string;
    card4Description: string;
    card4Image: string;
    card5Title: string;
    card5Description: string;
    card5Image: string;
    card6Title: string;
    card6Description: string;
    card6Image: string;
}

export default function OurServicesManagement() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [recordId, setRecordId] = useState<string | null>(null);
    const [title, setTitle] = useState("");
    const [cards, setCards] = useState([
        { title: "", description: "", image: "" },
        { title: "", description: "", image: "" },
        { title: "", description: "", image: "" },
        { title: "", description: "", image: "" },
        { title: "", description: "", image: "" },
        { title: "", description: "", image: "" },
    ]);

    const fetchOurServices = async () => {
        try {
            const res = await fetch("/api/ourservices");
            const json = await res.json();
            if (json.success) {
                const first: OurServicesRecord | undefined = (json.data || [])[0];
                if (first?.id) {
                    setRecordId(first.id);
                    setTitle(first.title || "");
                    setCards([
                        { title: first.card1Title || "", description: first.card1Description || "", image: first.card1Image || "" },
                        { title: first.card2Title || "", description: first.card2Description || "", image: first.card2Image || "" },
                        { title: first.card3Title || "", description: first.card3Description || "", image: first.card3Image || "" },
                        { title: first.card4Title || "", description: first.card4Description || "", image: first.card4Image || "" },
                        { title: first.card5Title || "", description: first.card5Description || "", image: first.card5Image || "" },
                        { title: first.card6Title || "", description: first.card6Description || "", image: first.card6Image || "" },
                    ]);
                } else {
                    setRecordId(null);
                }
            }
        } catch (e) {
            console.error("Error fetching OurServices:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOurServices();
    }, []);

    const handleCardImageUpload = (index: number, urls: string[]) => {
        const first = urls?.[0];
        if (first) {
            const newCards = [...cards];
            newCards[index].image = first;
            setCards(newCards);
        }
    };

    const handleCardChange = (index: number, field: "title" | "description", value: string) => {
        const newCards = [...cards];
        newCards[index][field] = value;
        setCards(newCards);
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            const payload = {
                title,
                card1Title: cards[0].title,
                card1Description: cards[0].description,
                card1Image: cards[0].image,
                card2Title: cards[1].title,
                card2Description: cards[1].description,
                card2Image: cards[1].image,
                card3Title: cards[2].title,
                card3Description: cards[2].description,
                card3Image: cards[2].image,
                card4Title: cards[3].title,
                card4Description: cards[3].description,
                card4Image: cards[3].image,
                card5Title: cards[4].title,
                card5Description: cards[4].description,
                card5Image: cards[4].image,
                card6Title: cards[5].title,
                card6Description: cards[5].description,
                card6Image: cards[5].image,
            };

            const res = await fetch(
                recordId ? `/api/ourservices/${recordId}` : "/api/ourservices",
                {
                    method: recordId ? "PUT" : "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                }
            );

            const json = await res.json();
            if (!json.success) throw new Error(json.error || "Failed to save OurServices");

            if (!recordId && json?.data?.id) setRecordId(json.data.id);

            alert("OurServices saved successfully!");
        } catch (e) {
            console.error("Error saving OurServices:", e);
            alert("Error saving OurServices");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!recordId) return;
        if (!confirm("Are you sure you want to delete the OurServices content?")) return;
        try {
            const res = await fetch(`/api/ourservices/${recordId}`, { method: "DELETE" });
            const json = await res.json();
            if (!json.success) throw new Error(json.error || "Failed to delete OurServices");

            setRecordId(null);
            setTitle("");
            setCards(cards.map(() => ({ title: "", description: "", image: "" })));

            alert("OurServices deleted successfully!");
        } catch (e) {
            console.error("Error deleting OurServices:", e);
            alert("Error deleting OurServices");
        }
    };

    if (loading) {
        return (
            <div className="p-8">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded w-64 mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
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
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Our Services Management</h1>
                    <p className="text-gray-600">Manage the Our Services section title and 6 service cards</p>
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
                        placeholder="Our Services section title"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card, index) => (
                        <div key={index} className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Card {index + 1}</h3>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                                <input
                                    value={card.title}
                                    onChange={(e) => handleCardChange(index, "title", e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Card title"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={card.description}
                                    onChange={(e) => handleCardChange(index, "description", e.target.value)}
                                    className="w-full border border-gray-300 rounded-md p-2 text-sm min-h-[60px] focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Card description"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">Image</label>
                                <Upload onFilesUpload={(urls) => handleCardImageUpload(index, urls)} />
                                {card.image && (
                                    <div className="relative w-full h-32 rounded-md overflow-hidden border mt-2">
                                        <Image src={card.image} alt={`Card ${index + 1}`} fill className="object-cover" />
                                    </div>
                                )}
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
                    {saving ? "Saving..." : recordId ? "Update Our Services" : "Create Our Services"}
                </button>

                {recordId && (
                    <button
                        onClick={handleDelete}
                        className="bg-red-50 text-red-600 border border-red-200 px-6 py-2.5 rounded-md hover:bg-red-100 transition"
                    >
                        Delete Our Services
                    </button>
                )}
            </div>

            {!recordId && (
                <div className="text-center py-8">
                    <p className="text-gray-500 text-sm">
                        No OurServices record yet — fill the form and click “Create Our Services”.
                    </p>
                </div>
            )}
        </div>
    );
}
