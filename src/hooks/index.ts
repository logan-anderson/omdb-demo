import { useEffect, useState } from "react"

const URL = 'http://www.omdbapi.com'

const API_KEY = process.env.REACT_APP_API_KEY as string

export interface QueryParams {
    search: string,
}
export interface Search {
    Title: string;
    Year: string;
    imdbID: string;
    Type: string;
    Poster: string;
}

export interface Data {
    Search: Search[];
    totalResults: string;
    Response: string;
}
export interface HookResponse {
    loading: boolean,
    data: Data
}
export function useFetchIMDB({ search }: QueryParams) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<Data | null>(null)
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const params = new URLSearchParams()
            params.append('apikey', API_KEY)
            params.append('s', search)
            params.append('type', 'movie')
            const res = await fetch(`${URL}/?${params.toString()}`)
            const data: Data = await res.json()
            setData(data)
            setLoading(false)
        }
        fetchData()
    }, [search])

    return {
        loading,
        data
    }
}