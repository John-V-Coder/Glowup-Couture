import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEmailTemplates, saveEmailTemplate } from "@/store/email-slice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EmailTemplates() {
  const dispatch = useDispatch();
  const { templates, loading, error } = useSelector((state) => state.email);
  
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    htmlContent: "",
    textContent: "",
    category: "marketing",
    variables: []
  });

  const [editing, setEditing] = useState(false);

  useEffect(() => {
    dispatch(getEmailTemplates());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveEmailTemplate(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setFormData({
          name: "",
          subject: "",
          htmlContent: "",
          textContent: "",
          category: "marketing",
          variables: []
        });
        setEditing(false);
        dispatch(getEmailTemplates());
      }
    });
  };

  const handleEdit = (template) => {
    setFormData(template);
    setEditing(true);
  };

  const handleVariableChange = (index, field, value) => {
    const updatedVars = [...formData.variables];
    updatedVars[index][field] = value;
    setFormData({ ...formData, variables: updatedVars });
  };

  const addVariable = () => {
    setFormData({
      ...formData,
      variables: [...formData.variables, { name: "", description: "", required: false }]
    });
  };

  const removeVariable = (index) => {
    setFormData({
      ...formData,
      variables: formData.variables.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>{editing ? "Edit Template" : "Create Template"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="Template Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              required
            />
            <Textarea
              placeholder="HTML Content"
              value={formData.htmlContent}
              onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })}
              required
            />
            <Textarea
              placeholder="Text Content"
              value={formData.textContent}
              onChange={(e) => setFormData({ ...formData, textContent: e.target.value })}
              required
            />

            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auth">Auth</SelectItem>
                <SelectItem value="order">Order</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="notification">Notification</SelectItem>
              </SelectContent>
            </Select>

            {/* Variables */}
            <div>
              <h4 className="font-semibold">Variables</h4>
              {formData.variables.map((v, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <Input
                    placeholder="Name"
                    value={v.name}
                    onChange={(e) => handleVariableChange(i, "name", e.target.value)}
                  />
                  <Input
                    placeholder="Description"
                    value={v.description}
                    onChange={(e) => handleVariableChange(i, "description", e.target.value)}
                  />
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={v.required}
                      onChange={(e) => handleVariableChange(i, "required", e.target.checked)}
                    /> Required
                  </label>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => removeVariable(i)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button type="button" variant="secondary" onClick={addVariable} className="mt-2">
                + Add Variable
              </Button>
            </div>

            <Button type="submit" className="w-full">
              {editing ? "Update Template" : "Create Template"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Templates List */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="space-y-2">
              {templates?.data?.length > 0 ? (
                templates.data.map((t) => (
                  <div
                    key={t._id}
                    className="border p-3 rounded-md flex justify-between items-center"
                  >
                    <div>
                      <p className="font-bold">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.category}</p>
                    </div>
                    <Button size="sm" onClick={() => handleEdit(t)}>
                      Edit
                    </Button>
                  </div>
                ))
              ) : (
                <p>No templates found</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
