// Handle the state management of the form
import { useState } from 'react';

export const useFormData = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);

  const addTag = () => {
    const cleaned = tagInput.trim();
    if (cleaned && !tags.includes(cleaned)) {
      setTags([...tags, cleaned]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const clearForm = () => {
    setTitle("");
    setDescription("");
    setTagInput("");
    setTags([]);
  };

  return {
    title,
    setTitle,
    description,
    setDescription,
    tagInput,
    setTagInput,
    tags,
    addTag,
    removeTag,
    clearForm,
  };
};