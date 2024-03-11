import { Stack, Pagination } from "@mui/material";
import { MetaData } from "../models/pagination"

interface Props {
    name: string;
    metaData: MetaData;
    onChange: (params: any) => void;
}

export default function AppPagination({ name, metaData, onChange }: Props) {
    const { currentPage, totalPages } = metaData;
    return (
        <Stack display='flex' justifyContent='space-between' alignItems='center' sx={{ marginTop: 5 }}>
            <Pagination
                page={currentPage}
                count={totalPages}
                onChange={(e, page) => onChange({
                    name,
                    value: page
                })}
                color="primary" />
        </Stack>
    )
}