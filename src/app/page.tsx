'use client'
import { useEffect, useState } from "react"
import { collection, Firestore, getDocs, getFirestore } from "firebase/firestore"
import { db } from "@/lib/firebaseInit"
import Link from "next/link"
import Image from "next/image"

export interface Product {
  uuid: string,
  id: number,
  title: string,
  description: string,
  category: string,
  price: number,
  discountPercentage: number,
  rating: number,
  stock: number,
  tags: string[],
  brand: string,
  sku: string,
  weight: number,
  dimensions: {
    width: number,
    height: number,
    depth: number
  },
  warrantyInformation: string,
  shippingInformation: string,
  availabilityStatus: string,
  reviews: {
    rating: number,
    comment: string,
    date: string,
    reviewerName: string
    reviewerEmail: string
  }[],
  returnPolicy: string,
  minimumOrderQuantity: number,
  meta: {
    createdAt: string,
    updatedAt: string,
    barcode: string,
    qrCode: string
  },
  images: string[],
  thumbnail: string
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>()
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchProducts = async (db: Firestore) => {
      try {
        const productsCollection = collection(db, 'products')
        const productSnapshot = await getDocs(productsCollection)
        const productsList = productSnapshot.docs.map(doc => {
          return { uuid: doc.id, ...doc.data() } as Product
        }).slice(0, 8)
        setProducts(productsList)
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts(db)
  }, [])

  if (loading) {
    return <div className="flex min-h-[90vh] items-center justify-center">Loading...</div>
  }

  return (
    <main className="flex min-h-[90vh] flex-col items-center justify-between p-12">
      <div className="grid grid-cols-4 gap-4">
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
      <Link href='/products'>
        <button className="bg-blue-500 p-2 rounded-lg">Show All Products</button>
      </Link>
    </main>
  );
}
