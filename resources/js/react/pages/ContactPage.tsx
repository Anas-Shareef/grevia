import React, { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2, Mail, Phone, MapPin, Clock } from "lucide-react";
import { api } from "@/lib/api";

interface ContactPageData {
  page_title: string;
  page_description: string | null;
  company_name: string | null;
  support_email: string | null;
  phone: string | null;
  address: string | null;
  working_hours: string | null;
  map_embed_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
}

interface ContactFormData {
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const ContactPage = () => {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const result = await api.get('/content/contact');
        setData(result);
        if (result?.meta_title) document.title = result.meta_title;
        // set meta description if needed standard way
      } catch (error) {
        console.error("Failed to load contact page content", error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const onSubmit = async (formData: ContactFormData) => {
    setSubmitting(true);
    try {
      await api.post('/contact', formData);
      toast.success("Message sent successfully!", {
        description: "We have received your message and will get back to you shortly."
      });
      reset();
    } catch (error: any) {
      console.error("Submission error", error);
      const msg = error.message || "Failed to send message. Please try again.";
      toast.error("Error", { description: msg });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-forest" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-5xl font-heading font-medium text-forest mb-4">
                {data.page_title}
              </h1>
              {data.page_description && (
                <div
                  className="prose prose-forest mx-auto text-forest/80"
                  dangerouslySetInnerHTML={{ __html: data.page_description }}
                />
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-medium text-forest mb-6">Get in Touch</h2>
                  <div className="space-y-6">
                    {data.support_email && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-cream rounded-full text-forest">
                          <Mail className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-forest">Email Us</p>
                          <a href={`mailto:${data.support_email}`} className="text-forest/70 hover:text-forest transition-colors">
                            {data.support_email}
                          </a>
                        </div>
                      </div>
                    )}

                    {data.phone && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-cream rounded-full text-forest">
                          <Phone className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-forest">Call Us</p>
                          <a href={`tel:${data.phone}`} className="text-forest/70 hover:text-forest transition-colors">
                            {data.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {data.address && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-cream rounded-full text-forest">
                          <MapPin className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-forest">Visit Us</p>
                          <p className="text-forest/70 whitespace-pre-line">{data.address}</p>
                        </div>
                      </div>
                    )}

                    {data.working_hours && (
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-cream rounded-full text-forest">
                          <Clock className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-forest">Working Hours</p>
                          <p className="text-forest/70">{data.working_hours}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Map */}
                {data.map_embed_url && (
                  <div className="aspect-video w-full rounded-lg overflow-hidden border border-border shadow-sm">
                    <iframe
                      src={data.map_embed_url}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                )}
              </div>

              {/* Form */}
              <div className="bg-cream/30 p-8 rounded-2xl border border-forest/5">
                <h2 className="text-2xl font-medium text-forest mb-6">Send us a Message</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <input
                      {...register("full_name", { required: "Name is required" })}
                      placeholder="Your Name *"
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-forest placeholder:text-forest/40 focus:ring-1 focus:ring-forest/20"
                    />
                    {errors.full_name && <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <input
                        {...register("email", {
                          required: "Email is required",
                          pattern: { value: /^\S+@\S+$/i, message: "Invalid email" }
                        })}
                        placeholder="Email Address *"
                        className="w-full bg-white border-none rounded-lg px-4 py-3 text-forest placeholder:text-forest/40 focus:ring-1 focus:ring-forest/20"
                      />
                      {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div>
                      <input
                        {...register("phone")}
                        placeholder="Phone Number"
                        className="w-full bg-white border-none rounded-lg px-4 py-3 text-forest placeholder:text-forest/40 focus:ring-1 focus:ring-forest/20"
                      />
                    </div>
                  </div>

                  <div>
                    <input
                      {...register("subject", { required: "Subject is required" })}
                      placeholder="Subject *"
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-forest placeholder:text-forest/40 focus:ring-1 focus:ring-forest/20"
                    />
                    {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <textarea
                      {...register("message", {
                        required: "Message is required",
                        minLength: { value: 10, message: "Message must be at least 10 characters" }
                      })}
                      placeholder="Tell us more about your inquiry... *"
                      rows={5}
                      className="w-full bg-white border-none rounded-lg px-4 py-3 text-forest placeholder:text-forest/40 focus:ring-1 focus:ring-forest/20 resize-none"
                    />
                    {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-forest text-white font-medium py-3 rounded-lg hover:bg-forest/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ContactPage;
