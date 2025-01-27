'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import SelectStatus from "@/components/custom/SelectStatus";
import { Status } from "@/lib/configs/enum.status";
import config from "@/lib/configs/config.json";

const formSchema = z.object({
    name: z.string()
        .min(1, "Tên ổ cứng không được để trống")
        .max(100, "Tên ổ cứng không được vượt quá 100 ký tự"),
    type: z.string()
        .min(1, "Loại ổ cứng không được để trống"),
    capacity: z.string()
        .min(1, "Dung lượng ổ cứng không được để trống"),
    interface: z.string()
        .min(1, "Cổng không được để trống"),
    brand: z.string()
        .min(1, "Hãng sản xuất không được để trống")
        .max(50, "Thương hiệu không được vượt quá 50 ký tự"),
    status: z.nativeEnum(Status).default(Status.ACTIVE)
});

const Page = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "",
            capacity: "",
            interface: "",
            brand: "",
            status: Status.ACTIVE
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setLoading(true);
            const response = await fetch('/api/storages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Không thể tạo ổ cứng mới');
            }

            router.push('/quan-tri/quan-ly-o-cung');
            router.refresh();
        } catch (error) {
            console.error('Lỗi khi tạo ổ cứng:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto py-10">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl lg:text-3xl font-bold">Thêm ổ cứng mới</CardTitle>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base lg:text-lg">Tên ổ cứng</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Nhập tên ổ cứng" 
                                                {...field}
                                                className="focus:ring-2 h-10 lg:h-12 text-base lg:text-lg"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base lg:text-lg">Loại ổ cứng</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="focus:ring-2 h-10 lg:h-12 text-base lg:text-lg">
                                                    <SelectValue placeholder="Chọn loại ổ cứng" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {config.hard_drives.types.map((type) => (
                                                    <SelectItem key={type} value={type}>
                                                        {type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base lg:text-lg">Dung lượng</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="focus:ring-2 h-10 lg:h-12 text-base lg:text-lg">
                                                    <SelectValue placeholder="Chọn dung lượng" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {config.hard_drives.capacities.map((capacity) => (
                                                    <SelectItem key={capacity} value={capacity}>
                                                        {capacity}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="interface"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base lg:text-lg">Cổng kết nối</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="focus:ring-2 h-10 lg:h-12 text-base lg:text-lg">
                                                    <SelectValue placeholder="Chọn cổng kết nối" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {config.hard_drives.interfaces.map((interface_type) => (
                                                    <SelectItem key={interface_type} value={interface_type}>
                                                        {interface_type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base lg:text-lg">Hãng sản xuất</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="focus:ring-2 h-10 lg:h-12 text-base lg:text-lg">
                                                    <SelectValue placeholder="Chọn hãng sản xuất" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {config.hard_drives.brands.map((brand) => (
                                                    <SelectItem key={brand} value={brand}>
                                                        {brand}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-base lg:text-lg">Trạng thái</FormLabel>
                                        <FormControl>
                                            <SelectStatus
                                                value={field.value as Status}
                                                onValueChange={field.onChange}
                                                options="basic"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex justify-end gap-4 lg:gap-6 pt-6">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    className="w-[120px] lg:w-[140px] h-10 lg:h-12 text-base lg:text-lg"
                                >
                                    Hủy
                                </Button>
                                <Button 
                                    type="submit"
                                    disabled={loading}
                                    className="w-[120px] lg:w-[140px] h-10 lg:h-12 text-base lg:text-lg"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2 lg:gap-3">
                                            <div className="h-4 w-4 lg:h-5 lg:w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                                            <span>Đang xử lý</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 lg:gap-3">
                                            <Save className="h-4 w-4 lg:h-5 lg:w-5" />
                                            <span>Lưu</span>
                                        </div>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
};

export default Page;
