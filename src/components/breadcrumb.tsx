'use client'
import Link from "next/link";
import { db } from "@/lib/firebaseInit";
import { doc, getDoc } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Breadcrumb() {
    const [pathArray, setPathArray] = useState<string[]>([]);
    const [breadcrumbNames, setBreadcrumbNames] = useState<{ [key: string]: string }>({});
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setPathArray(pathname.split('/'));
    }, [pathname]);

    useEffect(() => {
        const fetchProductNames = async () => {
            const names: { [key: string]: string } = {};

            for (const p of pathArray) {
                if (p === '') {
                    names[p] = 'Home';
                }
                else if (p.match(/^[a-zA-Z0-9]{20}$/)) {
                    names[p] = await getProductName(p);
                } else {
                    names[p] = p.charAt(0).toUpperCase() + p.slice(1);
                }
            }
            setBreadcrumbNames(names);
            setLoading(false);
        };

        fetchProductNames();
    }, [pathArray]);

    const getProductName = async (id: string) => {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return docSnap.data().title;
        }
        return id;
    };

    if (loading) {
        return <p className="m-4">Loading...</p>
    }

    return (
        <div className="m-4">
            {
                Object.keys(breadcrumbNames).map((key, index) => {
                    const isLast = index === Object.keys(breadcrumbNames).length - 1;
                    const to = `/${Object.keys(breadcrumbNames).slice(1, index + 1).join('/')}`;
                    return (
                        <span key={index}>
                            {
                                isLast ? (
                                    breadcrumbNames[key]
                                ) : (
                                    <>
                                        <Link href={to} className="hover:underline text-blue-600">
                                            {breadcrumbNames[key]}
                                        </Link>
                                        <span className="mx-2">/</span>
                                    </>
                                )
                            }
                        </span>
                    )
                })
            }
        </div>
    );
}
