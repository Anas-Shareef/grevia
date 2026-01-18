import { Star, Check, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface Review {
    id: number;
    rating: number;
    title: string;
    comment: string;
    customer: string; // From backend accessor
    user_name?: string;
    guest_name?: string;
    is_verified_purchase: boolean;
    created_at: string;
    status: string;
    user?: { name: string };
}

const ReviewsSection = ({ productId }: { productId: number }) => {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        title: "",
        comment: "",
        guest_name: "",
        guest_email: ""
    });

    // Fetch approved reviews for this product
    const { data: reviews = [] } = useQuery<Review[]>({
        queryKey: ['reviews', productId],
        queryFn: async () => {
            // Ensure endpoint supports filtering by product_id
            const res = await api.get(`/reviews?product_id=${productId}`);
            // Handle different response structures if necessary (e.g. paginated)
            return Array.isArray(res) ? res : (res.data || []);
        }
    });

    const submitReviewMutation = useMutation({
        mutationFn: (data: any) => api.post('/reviews', data),
        onSuccess: (response: any) => {
            toast.success(user ? "Review submitted successfully!" : "Review submitted! It will appear after approval.");
            setFormData({ title: "", comment: "", guest_name: "", guest_email: "" });
            setRating(0);
            setIsFormOpen(false);
            // Invalidate cache to refetch if immediate approval (though rare)
            queryClient.invalidateQueries({ queryKey: ['reviews', productId] });
        },
        onError: (error: any) => {
            toast.error(error.message || "Failed to submit review.");
        }
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }

        const payload: any = {
            product_id: productId,
            rating,
            title: formData.title,
            comment: formData.comment,
        };

        if (!user) {
            payload.guest_name = formData.guest_name;
            payload.guest_email = formData.guest_email;
        }

        submitReviewMutation.mutate(payload);
    };

    const hasReviews = reviews.length > 0;
    const averageRating = hasReviews
        ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
        : 0;

    return (
        <section className="py-16 md:py-24 bg-secondary/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-12 items-start">

                    {/* Summary Column */}
                    <div className="w-full md:w-1/3 sticky top-24">
                        <h2 className="text-3xl font-black text-foreground mb-6">Customer Reviews</h2>

                        <div className="bg-card border border-border rounded-squircle-xl p-6 mb-8">
                            <div className="flex items-end gap-4 mb-4">
                                <span className="text-5xl font-black text-foreground">{averageRating}</span>
                                <div className="mb-2">
                                    <div className="flex text-lime mb-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? "fill-current" : "text-muted-foreground/30"}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-muted-foreground">Based on {reviews.length} reviews</p>
                                </div>
                            </div>

                            <Button variant="limeLg" size="xl" className="w-full" onClick={() => setIsFormOpen(!isFormOpen)}>
                                {isFormOpen ? "Cancel Review" : "Write a Review"}
                            </Button>
                        </div>

                        {/* Review Form */}
                        {isFormOpen && (
                            <div className="bg-card border border-border rounded-squircle-xl p-6 animate-in slide-in-from-top-4 fade-in">
                                <h3 className="font-bold text-lg mb-4">Write your review</h3>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <Label>Rating</Label>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    key={star}
                                                    type="button"
                                                    className={`transition-colors ${star <= (hoverRating || rating) ? "text-lime fill-lime" : "text-muted-foreground/30"}`}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(star)}
                                                >
                                                    <Star className="w-8 h-8 fill-current" />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {!user && (
                                        <>
                                            <div>
                                                <Label htmlFor="guest_name">Name</Label>
                                                <Input
                                                    id="guest_name"
                                                    value={formData.guest_name}
                                                    onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                                                    required
                                                    placeholder="Your Name"
                                                />
                                            </div>
                                            <div>
                                                <Label htmlFor="guest_email">Email</Label>
                                                <Input
                                                    id="guest_email"
                                                    type="email"
                                                    value={formData.guest_email}
                                                    onChange={(e) => setFormData({ ...formData, guest_email: e.target.value })}
                                                    required
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </>
                                    )}

                                    <div>
                                        <Label htmlFor="title">Review Title</Label>
                                        <Input
                                            id="title"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            required
                                            placeholder="Great product!"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="comment">Experience</Label>
                                        <Textarea
                                            id="comment"
                                            value={formData.comment}
                                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                            required
                                            placeholder="Tell us what you liked..."
                                            rows={4}
                                        />
                                    </div>
                                    <Button type="submit" disabled={submitReviewMutation.isPending} className="w-full">
                                        {submitReviewMutation.isPending ? "Submitting..." : "Submit Review"}
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>

                    {/* Reviews List */}
                    <div className="flex-1 w-full space-y-6">
                        {reviews.length === 0 ? (
                            <div className="text-center py-12 text-muted-foreground">
                                No reviews yet. Be the first to share your experience!
                            </div>
                        ) : (
                            reviews.map((review) => (
                                <div key={review.id} className="bg-card border border-border rounded-squircle-xl p-6 hover:border-lime/30 transition-colors">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                                                <UserIcon className="w-5 h-5 text-muted-foreground" />
                                            </div>
                                            <div>
                                                {/* Fallback to guest_name or user_name if customer computed property isn't perfect */}
                                                <h4 className="font-bold text-foreground">
                                                    {review.user?.name || review.guest_name || 'Customer'}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    {review.is_verified_purchase ? (
                                                        <span className="text-lime flex items-center gap-1 font-medium">
                                                            <Check className="w-3 h-3" /> Verified Buyer
                                                        </span>
                                                    ) : (
                                                        <span>Verified Reviewer</span>
                                                    )}
                                                    <span>•</span>
                                                    <span>{new Date(review.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex text-lime mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? "fill-current" : "text-muted-foreground/30"}`} />
                                        ))}
                                    </div>
                                    <h5 className="font-bold text-lg mb-2">{review.title}</h5>
                                    <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                                </div>
                            ))
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ReviewsSection;
