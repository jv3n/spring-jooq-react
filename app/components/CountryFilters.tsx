'use client';

import { useState } from 'react';
import {
  Box,
  TextField,
  Select,
  MenuItem,
  Button,
  InputLabel,
  FormControl
} from '@mui/material';

type Filters = {
  name?: string;
  iso3?: string;
  region?: string;
  currency?: string;
};

type Props = {
  onSearch: (filters: Filters) => void;
  availableRegions: string[];
};

export default function CountryFilters({ onSearch, availableRegions }: Props) {
  const [filters, setFilters] = useState<Filters>({});

  const updateField = (key: keyof Filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    onSearch(filters);
  };

  return (
      <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            p: 2,
            mb: 2,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: '#fff',
          }}
      >
        <TextField
            label="Nom"
            variant="outlined"
            size="small"
            value={filters.name || ''}
            onChange={(e) => updateField('name', e.target.value)}
        />

        <TextField
            label="ISO3"
            variant="outlined"
            size="small"
            value={filters.iso3 || ''}
            onChange={(e) => updateField('iso3', e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Région</InputLabel>
          <Select
              label="Région"
              value={filters.region || ''}
              onChange={(e) => updateField('region', e.target.value)}
          >
            <MenuItem value="">
              <em>Toutes</em>
            </MenuItem>
            {availableRegions.map((r) => (
                <MenuItem key={r} value={r}>{r}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
            label="Devise"
            variant="outlined"
            size="small"
            value={filters.currency || ''}
            onChange={(e) => updateField('currency', e.target.value)}
        />

        <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            sx={{ height: 40 }}
        >
          Rechercher
        </Button>
      </Box>
  );
}
