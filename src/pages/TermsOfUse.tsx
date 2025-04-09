import React, { useEffect, useState } from "react";
import { getFetch } from "../utils/apiCall"; // Adjust path if needed

interface Section {
  _id: string;
  subheader: string;
  paragraph: string;
}

interface TermsData {
  date: string;
  header: string;
  content: Section[];
}

const TermsOfUse: React.FC = () => {
  const [terms, setTerms] = useState<TermsData | null>(null);

  useEffect(() => {
    const fetchTerms = async () => {
      try {
        const response: any = await getFetch(
          "/public/siteContent/termsAndConditions"
        );
        if (response?.success && response?.data) {
          setTerms(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch terms and conditions", err);
      }
    };

    fetchTerms();
  }, []);

  if (!terms) {
    return (
      <div className="text-center mt-20 text-gray-600 dark:text-gray-300">
        Loading Terms of Use...
      </div>
    );
  }

  const formattedDate = new Date(terms.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "2-digit",
  });

  return (
    <div className="max-w-4xl mx-auto my-2 md:my-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
        {terms.header || "Terms of Use"}
      </h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Last Updated: {formattedDate || "N/A"}
      </p>

      {terms.content.map(({ _id, subheader, paragraph }, index) => (
        <section key={_id || index}>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
            {index + 1}. {subheader}
          </h2>
          <p className="text-gray-700 dark:text-gray-300">{paragraph}</p>
        </section>
      ))}
    </div>
  );
};

export default TermsOfUse;
