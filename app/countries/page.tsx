'use client';

import {useEffect, useState} from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel
} from '@mui/material';
import {useRouter} from 'next/navigation';
import CountryFilters from "@/app/components/CountryFilters";

type CountryTable = {
  id: number;
  name: string;
  iso3: string;
  numericCode: string;
  capitalName: string;
  currency: string;
  region: string;
  subregion: string;
  latitudeLongitude: string;
  emoji: string;
};

type Order = 'asc' | 'desc';

export default function CountryTablePage() {
  const [countries, setCountries] = useState<CountryTable[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof CountryTable>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [regions, setRegions] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/country-table')
    .then((res) => res.json())
    .then((data) => setCountries(data))
    .catch((err) => console.error('Erreur fetch', err));
  }, []);

  const handleRequestSort = (property: keyof CountryTable) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedCountries = [...countries].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    return (aValue < bValue ? -1 : 1) * (order === 'asc' ? 1 : -1);
  });

  const visibleCountries = sortedCountries.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const handleRowClick = (country: CountryTable) => {
    router.push(`/countries/${country.iso3}`);
  };

  const searchCountries = (filters: Record<string, string>) => {
    fetch('http://127.0.0.1:8080/api/countries/search', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(filters),
    })
    .then((res) => res.json())
    .then(setCountries)
    .catch((err) => console.error('Erreur recherche', err));
  };

  return (
      <>
        <CountryFilters onSearch={searchCountries} availableRegions={regions}/>
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


            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {['id', 'Name', 'iso3', 'Code', 'Capital', 'Currency', 'Region', 'Subregion', 'Latitude', 'emoji'].map((col) => (
                        <TableCell key={col}>
                          <TableSortLabel
                              active={orderBy === col}
                              direction={orderBy === col ? order : 'asc'}
                              onClick={() => handleRequestSort(col as keyof CountryTable)}
                          >
                            {col}
                          </TableSortLabel>
                        </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {visibleCountries.map((row) => (
                      <TableRow key={row.id} hover onClick={() => handleRowClick(row)}
                                sx={{cursor: 'pointer'}}>
                        <TableCell>{row.id}</TableCell>
                        <TableCell>{row.name}</TableCell>
                        <TableCell>{row.iso3}</TableCell>
                        <TableCell>{row.numericCode}</TableCell>
                        <TableCell>{row.capitalName}</TableCell>
                        <TableCell>{row.currency}</TableCell>
                        <TableCell>{row.region}</TableCell>
                        <TableCell>{row.subregion}</TableCell>
                        <TableCell>{row.latitudeLongitude}</TableCell>
                        <TableCell>{row.emoji}</TableCell>
                      </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
                component="div"
                count={countries.length}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                rowsPerPageOptions={[10, 20, 30]}
                labelRowsPerPage="Pays par page"
            />

        </Box>
      </>
  );
}
