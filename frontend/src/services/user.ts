import { api } from "@/lib/api"
import { queryOptions } from "@tanstack/react-query"

export async function getCurrentUser() {
    const res = await api.me.$get()
    if(!res.ok){
        throw new Error("server error")
    }
    const data = await res.json()
    return data
}

export const userQueryOptions = queryOptions({
    queryKey: ["get-current-user"],
    queryFn: getCurrentUser,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnWindowFocus: false
}
)