import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { Save, RefreshCw, Eye, Edit3 } from "lucide-react";

function AdminAbout() {
  const [aboutData, setAboutData] = useState({
    heroTitle: "Glowup Couture",
    heroSubtitle: "Where Fashion Meets Transformation",
    storyTitle: "Our Story",
    storyContent: [
      "Born from a passion for empowering individuals through fashion, Glowup Couture represents more than just clothing—it's a movement of self-expression and confidence.",
      "We believe that every person deserves to feel extraordinary in their own skin. Our carefully curated collections blend contemporary trends with timeless elegance, ensuring that every piece tells a story of transformation and empowerment.",
      "From our humble beginnings to becoming a trusted name in fashion, we've remained committed to quality, sustainability, and the belief that fashion should be accessible to everyone."
    ],
    mission: "To inspire confidence and celebrate individuality through exceptional fashion that makes every customer feel like the best version of themselves.",
    values: [
      {
        title: "Passion",
        description: "Every piece is crafted with love and attention to detail, ensuring you receive nothing but the best."
      },
      {
        title: "Community",
        description: "We're building a community of confident individuals who support and inspire each other."
      },
      {
        title: "Excellence",
        description: "We never compromise on quality, ensuring every customer receives exceptional value and service."
      }
    ],
    ctaTitle: "Ready for Your Glow Up?",
    ctaSubtitle: "Join thousands of satisfied customers who have transformed their style with Glowup Couture.",
    ctaButtonText: "Explore Our Collections"
  });

  const [isLoading, setIsLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);

  // Handle input changes
  const handleInputChange = (field, value) => {
    setAboutData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle story content changes
  const handleStoryChange = (index, value) => {
    setAboutData(prev => ({
      ...prev,
      storyContent: prev.storyContent.map((content, i) => 
        i === index ? value : content
      )
    }));
  };

  // Handle values changes
  const handleValueChange = (index, field, value) => {
    setAboutData(prev => ({
      ...prev,
      values: prev.values.map((val, i) => 
        i === index ? { ...val, [field]: value } : val
      )
    }));
  };

  // Save about data
  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Here you would typically save to your backend
      // For now, we'll just simulate saving to localStorage
      localStorage.setItem('aboutUsData', JSON.stringify(aboutData));
      
      toast({
        title: "Success!",
        description: "About Us content has been updated successfully.",
        variant: "default"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save About Us content. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load saved data on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('aboutUsData');
    if (savedData) {
      try {
        setAboutData(JSON.parse(savedData));
      } catch (error) {
        console.error('Error loading saved about data:', error);
      }
    }
  }, []);

  if (previewMode) {
    return (
      <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">About Us Preview</h1>
          <Button 
            onClick={() => setPreviewMode(false)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Edit3 className="w-4 h-4" />
            Edit Mode
          </Button>
        </div>
        
        {/* Preview Content */}
        <div className="bg-white rounded-lg p-8 shadow-md">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
              {aboutData.heroTitle}
            </h1>
            <p className="text-xl text-gray-600">{aboutData.heroSubtitle}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">{aboutData.storyTitle}</h2>
              {aboutData.storyContent.map((paragraph, index) => (
                <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
              ))}
            </div>
            <div className="bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p>{aboutData.mission}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {aboutData.values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{aboutData.ctaTitle}</h2>
            <p className="text-xl text-gray-600 mb-6">{aboutData.ctaSubtitle}</p>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full font-semibold">
              {aboutData.ctaButtonText}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 border-b pb-2">Manage About Us Page</h1>
        <div className="flex gap-3">
          <Button 
            onClick={() => setPreviewMode(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Preview
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          >
            {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isLoading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="heroTitle">Main Title</Label>
              <Input
                id="heroTitle"
                value={aboutData.heroTitle}
                onChange={(e) => handleInputChange('heroTitle', e.target.value)}
                placeholder="Enter main title"
              />
            </div>
            <div>
              <Label htmlFor="heroSubtitle">Subtitle</Label>
              <Input
                id="heroSubtitle"
                value={aboutData.heroSubtitle}
                onChange={(e) => handleInputChange('heroSubtitle', e.target.value)}
                placeholder="Enter subtitle"
              />
            </div>
          </CardContent>
        </Card>

        {/* Story Section */}
        <Card>
          <CardHeader>
            <CardTitle>Our Story Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storyTitle">Story Title</Label>
              <Input
                id="storyTitle"
                value={aboutData.storyTitle}
                onChange={(e) => handleInputChange('storyTitle', e.target.value)}
                placeholder="Enter story section title"
              />
            </div>
            {aboutData.storyContent.map((paragraph, index) => (
              <div key={index}>
                <Label htmlFor={`story-${index}`}>Paragraph {index + 1}</Label>
                <Textarea
                  id={`story-${index}`}
                  value={paragraph}
                  onChange={(e) => handleStoryChange(index, e.target.value)}
                  placeholder={`Enter paragraph ${index + 1} content`}
                  rows={3}
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mission Section */}
        <Card>
          <CardHeader>
            <CardTitle>Mission Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <Label htmlFor="mission">Mission</Label>
            <Textarea
              id="mission"
              value={aboutData.mission}
              onChange={(e) => handleInputChange('mission', e.target.value)}
              placeholder="Enter mission statement"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Values Section */}
        <Card>
          <CardHeader>
            <CardTitle>Company Values</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {aboutData.values.map((value, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Value {index + 1}</h4>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor={`value-title-${index}`}>Title</Label>
                    <Input
                      id={`value-title-${index}`}
                      value={value.title}
                      onChange={(e) => handleValueChange(index, 'title', e.target.value)}
                      placeholder="Enter value title"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`value-desc-${index}`}>Description</Label>
                    <Textarea
                      id={`value-desc-${index}`}
                      value={value.description}
                      onChange={(e) => handleValueChange(index, 'description', e.target.value)}
                      placeholder="Enter value description"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card>
          <CardHeader>
            <CardTitle>Call to Action Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="ctaTitle">CTA Title</Label>
              <Input
                id="ctaTitle"
                value={aboutData.ctaTitle}
                onChange={(e) => handleInputChange('ctaTitle', e.target.value)}
                placeholder="Enter CTA title"
              />
            </div>
            <div>
              <Label htmlFor="ctaSubtitle">CTA Subtitle</Label>
              <Input
                id="ctaSubtitle"
                value={aboutData.ctaSubtitle}
                onChange={(e) => handleInputChange('ctaSubtitle', e.target.value)}
                placeholder="Enter CTA subtitle"
              />
            </div>
            <div>
              <Label htmlFor="ctaButtonText">Button Text</Label>
              <Input
                id="ctaButtonText"
                value={aboutData.ctaButtonText}
                onChange={(e) => handleInputChange('ctaButtonText', e.target.value)}
                placeholder="Enter button text"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AdminAbout;
