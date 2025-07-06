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

type PageResult<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
};

type Order = 'asc' | 'desc';

export default function CountryTablePage() {
  const [countries, setCountries] = useState<CountryTable[]>([]);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<keyof CountryTable>('name');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalElements, setTotalElements] = useState(0);
  const [regions, setRegions] = useState<string[]>([]);
  const router = useRouter();

  const fetchCountries = (filters: Record<string, string> = {}) => {
    const requestBody = {
      ...filters,
      pageRequest: {
        page,
        size: rowsPerPage,
        sort: [{field: orderBy, ascending: order === 'asc'}]
      }
    };

    fetch('/api/countries', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(requestBody),
    })
    .then((res) => res.json())
    .then((data: PageResult<CountryTable>) => {
      setCountries(data.content);
      setTotalElements(data.totalElements);
    })
    .catch((err) => console.error('Erreur recherche', err));
  };

  useEffect(() => {
    fetchCountries();
  }, [order, orderBy, page, rowsPerPage]);

  const handleRequestSort = (property: keyof CountryTable) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    setPage(0);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleRowClick = (country: CountryTable) => {
    router.push(`/countries/${country.iso3}`);
  };

  const searchCountries = (filters: Record<string, string>) => {
    setPage(0);
    fetchCountries(filters);
  };

  return (
      <>
        <CountryFilters onSearch={searchCountries} availableRegions={regions}/>
        <Box sx={{p: 2, mb: 2, borderRadius: 2, boxShadow: 3, backgroundColor: '#fff'}}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  {['ID', 'Name', 'ISO3', 'Code', 'Name', 'Currency', 'Region', 'Subregion', 'Latitude', 'emoji'].map((col) => (
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
                {countries.map((row) => (
                    <TableRow key={row.id} hover onClick={() => handleRowClick(row)} sx={{cursor: 'pointer'}}>
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
              count={totalElements}
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
