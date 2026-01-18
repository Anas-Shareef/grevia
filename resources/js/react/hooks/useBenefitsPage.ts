import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export interface BenefitsPageData {
    hero: {
        badge?: string;
        title: string;
        subtitle: string;
        background_image: string | null;
        cta_text?: string | null;
        cta_link?: string | null;
    };
    // benefits: Deprecated
    sections: Array<{
        badge?: string;
        title: string;
        description: string;
        image: string | null;
        alignment: "left" | "right";
        features?: Array<{
            icon: string;
            title: string;
            description: string;
            order: number;
            is_active: boolean;
        }>;
        is_active: boolean;
    }>;
    comparison?: {
        title: string;
        subtitle: string;
        columns: Array<{
            title: string;
            type: "success" | "danger" | "warning";
            points: Array<{
                text: string;
                type: "success" | "danger" | "warning";
            }>;
            is_active: boolean;
        }>;
    };
    cta?: {
        heading: string;
        description: string;
        primary_button?: { text: string; link: string } | null;
        secondary_button?: { text: string; link: string } | null;
    };
}

export const useBenefitsPage = () => {
    return useQuery({
        queryKey: ["benefits-page"],
        queryFn: async () => {
            const response = await api.get("/content/benefits-page");
            return response as BenefitsPageData;
        },
    });
};
