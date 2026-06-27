export interface Filter {
    id: string,
    name: string,
    image_url: string
}

export type FilterMap =  {[key: string]: Filter}

export interface Restaurant {
    id: string,
    name: string,
    rating: number,
    filterIds: string[],
    image_url: string,
    delivery_time_minutes: number,
    isOpen?: boolean
}

export type isOpenResponse =
    {restaurant_id: string, is_currently_open: boolean}
    | string

