import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Star, Trash2, Edit2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

interface Review {
    id: number;
    product: {
        id: number;
        name: string;
        image_url: string;
        slug: string;
    };
    rating: number;
    title: string;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    is_verified_purchase: boolean;
}

const ReviewsPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [formData, setFormData] = useState<Partial<Review>>({});
    const { toast } = useToast();

    const fetchReviews = async () => {
        try {
            const response = await api.getReviews();
            setReviews(response || []);
        } catch (error) {
            console.error("Failed to fetch reviews");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this review?")) return;
        try {
            await api.deleteReview(id);
            toast({ title: "Review deleted" });
            fetchReviews();
        } catch (error) {
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    const openEdit = (review: Review) => {
        if (review.status !== 'pending') {
            toast({ title: "Cannot edit processed reviews", variant: "destructive" });
            return;
        }
        setEditingReview(review);
        setFormData({ rating: review.rating, title: review.title, comment: review.comment });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingReview) return;

        try {
            await api.updateReview(editingReview.id, formData);
            toast({ title: "Review updated successfully" });
            setIsDialogOpen(false);
            setEditingReview(null);
            fetchReviews();
        } catch (error: any) {
            toast({ title: "Update failed", description: error.message, variant: "destructive" });
        }
    };

    if (loading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">My Reviews</h2>

            {reviews.length === 0 ? (
                <Card>
                    <CardContent className="h-40 flex items-center justify-center text-gray-500">
                        You haven't written any reviews yet.
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {reviews.map((review) => (
                        <Card key={review.id}>
                            <CardHeader className="flex flex-row items-start gap-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                    <img src={review.product?.image_url || 'https://placehold.co/100'} alt={review.product?.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-base">{review.product?.name}</CardTitle>
                                            <div className="flex items-center gap-2 mt-1">
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                                                    ))}
                                                </div>
                                                <span className="font-semibold">{review.title}</span>
                                            </div>
                                        </div>
                                        <Badge variant={
                                            review.status === 'approved' ? 'default' :
                                                review.status === 'rejected' ? 'destructive' : 'secondary'
                                        }>
                                            {review.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        {review.comment}
                                    </div>
                                    <div className="mt-4 flex justify-between items-center">
                                        <span className="text-xs text-gray-400">Posted on {new Date(review.created_at).toLocaleDateString()}</span>
                                        <div className="flex gap-2">
                                            {review.status === 'pending' && (
                                                <Button variant="ghost" size="sm" onClick={() => openEdit(review)}>
                                                    <Edit2 className="h-4 w-4 mr-1" /> Edit
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(review.id)}>
                                                <Trash2 className="h-4 w-4 mr-1" /> Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Review</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Rating</Label>
                            <div className="flex gap-2 mt-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, rating: star })}
                                        className={`focus:outline-none ${star <= (formData.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                                    >
                                        <Star className="h-6 w-6 fill-current" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input id="title" value={formData.title || ''} onChange={e => setFormData({ ...formData, title: e.target.value })} required />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea id="comment" value={formData.comment || ''} onChange={e => setFormData({ ...formData, comment: e.target.value })} required />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Update Review</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ReviewsPage;
