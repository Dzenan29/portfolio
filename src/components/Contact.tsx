import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Send,
  Download,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const { toast } = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Message Sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 px-6 bg-surface/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            {t("contact.title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto rounded-full mb-8" />
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t("contact.description")}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="glass-card animate-slide-in-left">
            <CardHeader>
              <CardTitle className="text-2xl">
                {t("contact.sendTitle")}
              </CardTitle>
              <CardDescription>{t("contact.sendDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder={t("contact.name")}
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="bg-surface/50 border-accent/20 focus:border-accent"
                  />
                  <Input
                    name="email"
                    type="email"
                    placeholder={t("contact.email")}
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="bg-surface/50 border-accent/20 focus:border-accent"
                  />
                </div>
                <Input
                  name="subject"
                  placeholder={t("contact.subject")}
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="bg-surface/50 border-accent/20 focus:border-accent"
                />
                <Textarea
                  name="message"
                  placeholder={t("contact.message")}
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="bg-surface/50 border-accent/20 focus:border-accent resize-none"
                />
                <Button type="submit" className="hero-button w-full">
                  <Send className="mr-2 h-4 w-4" />
                  {t("contact.send")}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 animate-slide-in-right">
            <Card className="glass-card hover:bg-surface-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-semibold">
                    {t("contact.location")}
                  </h3>
                </div>
                <p className="text-muted-foreground">
                  Dortmund, Germany
                  <br />
                  Available for remote work across EU timezones
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card hover:bg-surface-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Mail className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-semibold">Email</h3>
                </div>
                <a
                  href="mailto:dzenankusi00@gmail.com"
                  className="text-accent-light hover:text-accent transition-colors"
                >
                  dzenankusi00@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="glass-card hover:bg-surface-hover transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Download className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-semibold">Resume</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Download my complete resume with detailed experience and
                  certifications
                </p>
                <a
                  href={`${import.meta.env.BASE_URL}Dzenan-Kusi-Lebenslauf.pdf`}
                  download="Dzenan-Kusi-CV.pdf"
                >
                  <Button
                    asChild
                    variant="outline"
                    className="glass-card hover:bg-surface-hover border-accent/30"
                  >
                    <span>
                      <Download className="mr-2 h-4 w-4" />
                      {t("contact.resume")}
                    </span>
                  </Button>
                </a>
              </CardContent>
            </Card>

            {/* Social Links */}
            <div className="flex justify-center space-x-4">
              <a
                href="https://github.com/Dzenan29"
                className="p-4 glass-card hover:bg-surface-hover transition-all duration-300 hover:scale-110 hover:text-accent group"
                aria-label={t("contact.github")}
              >
                <Github className="h-6 w-6 group-hover:animate-glow-pulse" />
              </a>
              <a
                href="https://de.linkedin.com/in/dzenan-kusi-752a98217"
                className="p-4 glass-card hover:bg-surface-hover transition-all duration-300 hover:scale-110 hover:text-accent group"
                aria-label={t("contact.linkedin")}
              >
                <Linkedin className="h-6 w-6 group-hover:animate-glow-pulse" />
              </a>
              <a
                href="mailto:dzenankusi00@gmail.com"
                className="p-4 glass-card hover:bg-surface-hover transition-all duration-300 hover:scale-110 hover:text-accent group"
                aria-label={t("contact.emailContact")}
              >
                <Mail className="h-6 w-6 group-hover:animate-glow-pulse" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
