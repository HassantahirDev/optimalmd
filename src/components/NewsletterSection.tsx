import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const NewsletterSection = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup
    console.log({ firstName, lastName, email });
  };

  return (
    <section className="section-padding bg-secondary/50">
      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Header */}
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-5xl font-bold">
              Stay Ahead in Health Optimization
            </h2>
            <div className="space-y-2">
              <p className="text-muted-foreground text-lg">
                Join our newsletter for <strong>expert insights, cutting-edge research, and actionable tips</strong>
              </p>
              <p className="text-muted-foreground text-lg">
                to help you optimize your <strong>hormones, metabolism, performance, and longevity</strong>.
              </p>
            </div>
          </div>

          {/* Newsletter Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="First Name*"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground h-14 text-lg rounded-full"
              />
              <Input
                type="text"
                placeholder="Last Name*"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground h-14 text-lg rounded-full"
              />
            </div>
            
            <div className="grid md:grid-cols-[1fr_auto] gap-4">
              <Input
                type="email"
                placeholder="Email*"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-background border-border text-foreground placeholder:text-muted-foreground h-14 text-lg rounded-full"
              />
              <Button 
                type="submit"
                className="btn-hero h-14 px-8 text-lg rounded-full"
              >
                Subscribe
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;