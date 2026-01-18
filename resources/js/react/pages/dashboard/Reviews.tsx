import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Link } from "react-router-dom";
import { Star, Edit, Trash2, AlertCircle, ShoppingBag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Review {
    id: number;
    product_id: number;
    rating: number;
    title: string;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    product: {
        id: number;
        name: string;
        slug: string;
        image: string;
        image_url?: string;
    };
}

const Reviews = () => {
    const queryClient = useQueryClient();
    const [editingReview, setEditingReview] = useState<Review | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    // Edit Form State
    const [editForm, setEditForm] = useState({
        rating: 0,
        title: "",
        comment: "",
    });

    const { data: reviews, isLoading } = useQuery<Review[]>({
        queryKey: ["my-reviews"],
        queryFn: async () => {
            // Assuming api.get returns the data array directly or axios response data
            const res = await api.get("/my-reviews");
            return res;
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/reviews/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            toast.success("Review deleted successfully");
            setDeletingId(null);
        },
        onError: () => {
            toast.error("Failed to delete review");
        }
    });

    const updateMutation = useMutation({
        mutationFn: async (data: { id: number; rating: number; title: string; comment: string }) => {
            await api.put(`/reviews/${data.id}`, {
                rating: data.rating,
                title: data.title,
                comment: data.comment,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["my-reviews"] });
            toast.success("Review updated successfully");
            setEditingReview(null);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update review");
        }
    });

    const handleEditClick = (review: Review) => {
        setEditingReview(review);
        setEditForm({
            rating: review.rating,
            title: review.title,
            comment: review.comment,
        });
    };

    const handleUpdate = () => {
        if (!editingReview) return;
        updateMutation.mutate({
            id: editingReview.id,
            ...editForm,
        });
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-black text-foreground">My Reviews</h1>
                <p className="text-muted-foreground">
                    Manage and track reviews you have submitted for products.
                </p>
            </div>

            {reviews && reviews.length > 0 ? (
                <div className="grid gap-4">
                    {reviews.map((review) => (
                        <div
                            key={review.id}
                            className="group bg-card border border-border/50 rounded-xl p-6 transition-all hover:border-lime/30 hover:shadow-sm"
                        >
                            <div className="flex flex-col md:flex-row gap-6">
                                {/* Product Info (Left) */}
                                <div className="flex md:flex-col items-center md:items-start gap-4 md:w-48 shrink-0">
                                    <div className="w-16 h-16 md:w-24 md:h-24 rounded-lg bg-secondary/30 overflow-hidden border border-border">
                                        <img
                                            src={review.product.image_url || review.product.image}
                                            alt={review.product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <Link to={`/product/${review.product.slug}`} className="font-bold text-sm text-foreground hover:text-primary line-clamp-2">
                                            {review.product.name}
                                        </Link>
                                        <span className="text-xs text-muted-foreground hidden md:inline-block">Product</span>
                                    </div>
                                </div>

                                {/* Review Info (Center) */}
                                <div className="flex-1 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <div className="flex">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    className={`w-4 h-4 ${star <= review.rating
                                                        ? "fill-lime text-lime"
                                                        : "text-muted-foreground/30"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <span className="font-bold text-sm">{review.title}</span>
                                    </div>

                                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">
                                        {review.comment}
                                    </p>

                                    <div className="flex items-center gap-3 pt-2">
                                        <Badge variant={
                                            review.status === 'approved' ? 'default' :
                                                review.status === 'rejected' ? 'destructive' : 'secondary'
                                        } className={
                                            review.status === 'approved' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                                review.status === 'rejected' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                                                    'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                                        }>
                                            {review.status.charAt(0).toUpperCase() + review.status.slice(1)}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {new Date(review.created_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions (Right) */}
                                <div className="flex md:flex-col items-end gap-2 shrink-0 md:ml-4 border-t md:border-t-0 md:border-l border-border mt-4 md:mt-0 pt-4 md:pt-0 md:pl-6">
                                    {review.status === 'pending' ? (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="w-full md:w-auto"
                                            onClick={() => handleEditClick(review)}
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    ) : (
                                        <div className="relative group/tooltip">
                                            <Button variant="ghost" size="sm" disabled className="w-full md:w-auto opacity-50 cursor-not-allowed">
                                                <Edit className="w-4 h-4 mr-2" />
                                                Edit
                                            </Button>
                                            <span className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded shadow-md opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                                {review.status === 'approved' ? "Approved" : "Rejected"} reviews cannot be edited
                                            </span>
                                        </div>
                                    )}

                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="w-full md:w-auto text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => setDeletingId(review.id)}
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-muted/30 rounded-2xl border border-dashed border-muted-foreground/20">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background border border-border shadow-sm mb-4">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">No reviews yet</h3>
                    <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                        You haven't reviewed any products yet. Share your experience with products you've purchased.
                    </p>
                    <Button asChild>
                        <Link to="/products">Browse Products</Link>
                    </Button>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingReview} onOpenChange={(open) => !open && setEditingReview(null)}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Edit Review</DialogTitle>
                        <DialogDescription>
                            Make changes to your review for {editingReview?.product.name}.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                            <Label>Rating</Label>
                            <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setEditForm({ ...editForm, rating: star })}
                                        className="focus:outline-none transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-8 h-8 ${star <= editForm.rating
                                                ? "fill-lime text-lime"
                                                : "text-muted-foreground/30 hover:text-lime"
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={editForm.title}
                                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                placeholder="Summary of your experience"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="comment">Comment</Label>
                            <Textarea
                                id="comment"
                                value={editForm.comment}
                                onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                                placeholder="Tell us more about the product..."
                                rows={5}
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingReview(null)}>Cancel</Button>
                        <Button onClick={handleUpdate} disabled={updateMutation.isPending || editForm.rating === 0}>
                            {updateMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={deletingId !== null} onOpenChange={(open) => !open && setDeletingId(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Review?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this review? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingId(null)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            onClick={() => deletingId && deleteMutation.mutate(deletingId)}
                            disabled={deleteMutation.isPending}
                        >
                            {deleteMutation.isPending ? "Deleting..." : "Delete Review"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default Reviews;
