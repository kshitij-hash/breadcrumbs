'use client'
import { db } from "@/lib/firebaseInit";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { useParams } from "next/navigation"
import { useEffect, useState } from "react";

interface Review {
    reviewerName: string,
    reviewerEmail: string,
    rating: number,
    date: string,
    comment: string
}

export default function Reviews() {
    const params = useParams()
    const { uuid } = params;
    const [reviews, setReviews] = useState<Review[]>()
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        try {
            const fetchProduct = async (uuid: string) => {
                const docRef = doc(db, "products", uuid)
                const docSnap = await getDoc(docRef)

                setReviews(docSnap.data()?.reviews)
            }
            fetchProduct(uuid as string)
        } catch (error) {
            console.error('Error fetching reviews: ', error)
        } finally {
            setLoading(false)
        }
    }, [uuid])

    if(loading) {
        return <div className="flex min-h-[90vh] items-center justify-center">Loading...</div>
    }

    return (
        <div className="flex min-h-[90vh] flex-col items-center justify-around p-12">
            {
                reviews && (
                    <div className="flex flex-col items-center w-full gap-2">
                        {reviews.map((review, index) => (
                            <div key={index} className="w-1/2 bg-gray-600 flex flex-col gap-2 border-2 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <p className="bg-green-500 px-1 text-white font-semibold rounded-md">{review.rating}⭐</p>
                                    <p className="text-white">{review.comment}</p>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <p className="font-bold">{review.reviewerName}</p>
                                    <p>{new Date(review.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }
        </div>
    )
}