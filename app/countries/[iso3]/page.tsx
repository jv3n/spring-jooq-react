'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

type CountryDetail = {
  id: number;
  name: string;
  iso2: string;
  iso3: string;
  numericCode: number;
  phoneCode: string;
  capitalName: string;
  currency: string;
  currencyName: string;
  currencySymbol: string;
  tld: string;
  nativeName: string;
  region: string;
  subregion: string;
  nationality: string;
  timezones: string;
  latitude: number;
  longitude: number;
  emoji: string;
  emojiU: string;
};

export default function CountryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const iso3 = typeof params.iso3 === 'string' ? params.iso3 : Array.isArray(params.iso3) ? params.iso3[0] : '';

  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!iso3) return;

    fetch(`/api/country-detail/${iso3}`)
    .then((res) => res.json())
    .then((data) => {
      setCountry(data.country);
      setLoading(false);
    })
    .catch((err) => {
      console.error('Error fetching country detail:', err);
      setLoading(false);
    });
  }, [iso3]);

  if (loading) return <p>Loading...</p>;
  if (!country) return <p>No data found</p>;

  return (
      <div className="max-w-5xl mx-auto">
        {/* Bouton en haut à gauche, en dehors de la card */}
        <button
            onClick={() => router.push('/countries')}
            className="mb-6 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
        >
          ← Retour à la liste
        </button>

        {/* Card centrée à 75% de largeur */}
        <div className="bg-white shadow-lg rounded-xl p-6 w-max">
          <h1 className="text-2xl font-bold mb-4">
            {country.name} {country.emoji}
          </h1>
          <ul className="space-y-2 text-gray-800">
            <li><strong>ISO3:</strong> {country.iso3}</li>
            <li><strong>Numeric Code:</strong> {country.numericCode}</li>
            <li><strong>Phone Code:</strong> {country.phoneCode}</li>
            <li><strong>Capital:</strong> {country.capitalName}</li>
            <li><strong>Currency:</strong> {country.currency} ({country.currencySymbol})</li>
            <li><strong>Currency Name:</strong> {country.currencyName}</li>
            <li><strong>Top Level Domain:</strong> {country.tld}</li>
            <li><strong>Native Name:</strong> {country.nativeName}</li>
            <li><strong>Region:</strong> {country.region}</li>
            <li><strong>Subregion:</strong> {country.subregion}</li>
            <li><strong>Nationality:</strong> {country.nationality}</li>
            <li><strong>Timezones:</strong> {country.timezones}</li>
            <li><strong>Latitude:</strong> {country.latitude}</li>
            <li><strong>Longitude:</strong> {country.longitude}</li>
            <li><strong>Emoji Unicode:</strong> {country.emojiU}</li>
          </ul>
        </div>
      </div>
  );
}
