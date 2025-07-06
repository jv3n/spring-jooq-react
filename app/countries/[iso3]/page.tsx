'use client';

import {useEffect, useState} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Box, Button, CardContent, List, ListItem, ListItemText, Typography,} from '@mui/material';

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
  const iso3 =
      typeof params.iso3 === 'string'
          ? params.iso3
          : Array.isArray(params.iso3)
              ? params.iso3[0]
              : '';

  const [country, setCountry] = useState<CountryDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!iso3) return;

    fetch(`/api/countries/${iso3}`)
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

  if (loading) return <Typography>Loading...</Typography>;
  if (!country) return <Typography>No data found</Typography>;

  return (
      <>
        <Button
            variant="contained"
            color="secondary"
            onClick={() => router.push('/countries')}
            sx={{mb: 3}}
        >
          ← Retour à la liste
        </Button>

        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 2,
          alignItems: 'center',
          p: 2,
          mb: 2,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: '#fff',
        }}>
          <CardContent>
            <CardContent
                sx={{
                  display: 'flex',
                  gap: 4,
                  flexWrap: 'wrap',
                  alignItems: 'center',
                }}
            >
              <Typography component="span" variant="h1">
                {country.emoji}
              </Typography>
              <Typography variant="h5" component="div" gutterBottom>
                {country.name}
              </Typography>
            </CardContent>

            <Box sx={{display: 'flex', gap: 4, flexWrap: 'wrap'}}>
              <List dense sx={{flex: 1, minWidth: '300px'}}>
                <ListItem><ListItemText primary="ISO3" secondary={country.iso3}/></ListItem>
                <ListItem><ListItemText primary="Numeric Code"
                                        secondary={country.numericCode}/></ListItem>
                <ListItem><ListItemText primary="Phone Code"
                                        secondary={country.phoneCode}/></ListItem>
                <ListItem><ListItemText primary="Capital"
                                        secondary={country.capitalName}/></ListItem>
                <ListItem>
                  <ListItemText
                      primary="Currency"
                      secondary={`${country.currency} (${country.currencySymbol})`}
                  />
                </ListItem>
                <ListItem><ListItemText primary="Currency Name"
                                        secondary={country.currencyName}/></ListItem>
                <ListItem><ListItemText primary="Top Level Domain"
                                        secondary={country.tld}/></ListItem>
                <ListItem><ListItemText primary="Native Name"
                                        secondary={country.nativeName}/></ListItem>
              </List>

              <List dense sx={{flex: 1, minWidth: '300px'}}>
                <ListItem><ListItemText primary="Region" secondary={country.region}/></ListItem>
                <ListItem><ListItemText primary="Subregion"
                                        secondary={country.subregion}/></ListItem>
                <ListItem><ListItemText primary="Nationality"
                                        secondary={country.nationality}/></ListItem>
                <ListItem><ListItemText primary="Timezones"
                                        secondary={country.timezones}/></ListItem>
                <ListItem><ListItemText primary="Latitude" secondary={country.latitude}/></ListItem>
                <ListItem><ListItemText primary="Longitude"
                                        secondary={country.longitude}/></ListItem>
                <ListItem><ListItemText primary="Emoji Unicode"
                                        secondary={country.emojiU}/></ListItem>
              </List>
            </Box>
          </CardContent>
        </Box>
      </>
  );
}
