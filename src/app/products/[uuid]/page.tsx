'use client'
import { Product } from "@/app/page"
import { db } from "@/lib/firebaseInit"
import { doc, getDoc, getFirestore } from "firebase/firestore"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import * as React from "react"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"


export default function ProductDetails() {
    const [productDetails, setProductDetails] = useState<Product>()
    const [loading, setLoading] = useState<boolean>(true)

    const params = useParams()
    const { uuid } = params

    useEffect(() => {
        try {
            const fetchProduct = async (uuid: string) => {
                const docRef = doc(db, "products", uuid)
                const docSnap = await getDoc(docRef)
                setProductDetails(docSnap.data() as Product)
            }
            fetchProduct(uuid as string)
        } catch (error) {
            console.error('Error fetching product details: ', error)
        } finally {
            setLoading(false)
        }
    }, [uuid])

    if (loading) {
        return <div className="flex min-h-[90vh] items-center justify-center">Loading...</div>
    }

    return (
        <div className="flex min-h-[90vh] flex-col items-center justify-between p-12">
            <div className="w-[500px] flex flex-col items-center border-4 rounded-lg">
                {productDetails && (
                    <>
                        <Carousel className="w-full max-w-xs my-4">
                            <CarouselContent>
                                {Array.from({ length: productDetails.images.length }).map((_, index) => (
                                    <CarouselItem key={index}>
                                        <div className="p-1">
                                            <Card>
                                                <CardContent className="flex aspect-square items-center justify-center p-6">
                                                    <Image src={productDetails.images[index]} alt={productDetails.title} width={200} height={200} />
                                                </CardContent>
                                            </Card>
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                        <div className="bg-gray-400 flex flex-col items-center rounded-md">
                            <section className="mt-4 flex items-center w-full justify-between px-2">
                                <h2 className="hover:text-red-700 hover:underline hover:cursor-default font-bold">{productDetails.title}</h2>
                                <p className="text-red-800 font-bold">${productDetails.price}</p>
                            </section>
                            <section className="px-2 flex items-center w-full mb-1 gap-1">
                                <p className="bg-green-500 text-white font-semibold rounded-md p-1">{productDetails.rating}⭐</p>
                                <Link href={`/products/${uuid}/reviews`}>
                                    <Button className="hover:text-white" variant='link'>Check Reviews</Button>
                                </Link>
                            </section>
                            <section className="w-full flex flex-col bg-gray-600 px-2 py-4 rounded-md">
                                <p className="text-red-600">Description:</p>
                                <p className="text-white">{productDetails.description}</p>
                            </section>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}