import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../config';

export const useTags = () => {
  const [tagOptions, setTagOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${BASE_URL}/api/tags`);
        const tagTitles = response.data.map((tag: any) => tag.title);
        setTagOptions(tagTitles);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch tags:", error);
        setError("Failed to load tags");
        // Fallback to some default tags if fetch fails
        setTagOptions([
          "Quick Play",
          "Family Friendly",
          "Strategy",
          "Party Game"
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  const addNewTag = (newTag: string) => {
    if (!tagOptions.includes(newTag)) {
      setTagOptions(prev => [...prev, newTag]);
    }
  };

  return {
    tagOptions,
    loading,
    error,
    addNewTag
  };
};
