'use client'
import { collection, Firestore, getDocs, getFirestore } from "firebase/firestore"
import { useEffect, useState } from "react"
import { Product } from "../page"
import { db } from "@/lib/firebaseInit"
import Link from "next/link"
import Image from "next/image"

export default function Products() {
    const [products, setProducts] = useState<Product[]>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        try {
            const fetchProducts = async (db: Firestore) => {
                const productsCollection = collection(db, 'products')
                const productSnapshot = await getDocs(productsCollection)
                const productsList = productSnapshot.docs.map(doc => {
                    return { uuid: doc.id, ...doc.data() } as Product
                })
                setProducts(productsList)
            }
            fetchProducts(db)
        } catch (error) {
            console.error('Error fetching products: ', error)
        } finally {
            setLoading(false)
        }
    }, [])

    if(loading) {
        return <div className="flex min-h-[90vh] items-center justify-center">Loading...</div>
    }
    return (
        <div className="flex min-h-[90vh] flex-col items-center justify-between p-12">
            <div className="grid grid-cols-3 gap-4">
                {products?.map(product => {
                    return (
                        <Link href={`/products/${product.uuid}`} key={product.uuid}>
                            <div className="flex flex-col items-center border">
                                <Image src={product.thumbnail} alt={product.title} width={200} height={200} />
                                <h2 className="border-t-2 w-full text-center">{product.title}</h2>
                                <p className="text-red-500">${product.price}</p>
                            </div>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}