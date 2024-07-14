'use client'
import { db } from "@/lib/firebaseInit";
import { doc, getDoc } from "firebase/firestore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import _ from 'lodash'

export default function Breadcrumb() {
    const [pathArray, setPathArray] = useState<string[]>([]);
    const [breadcrumbNames, setBreadcrumbNames] = useState<{ [key: string]: string }>({});
    const pathname = usePathname();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setPathArray(pathname.split('/').filter(p => p !== ''));
    }, [pathname]);

    useEffect(() => {
        const fetchProductNames = async () => {
            const names: { [key: string]: string } = {};

            for (const p of pathArray) {
                if (p.match(/^[a-zA-Z0-9]{20}$/)) {
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

    if(loading) {
        return <p className="m-4">Loading...</p>
    }

    return (
        <div className="m-4">
            {
                pathArray.length === 0 ? (
                    <span className="mx-2">Home</span>
                ) : (
                    <>
                        <Link href="/" className="hover:underline text-blue-600">
                            Home
                        </Link>
                        <span className="mx-2">/</span>
                    </>
                )
            }
            {
                (pathArray.length > 0 && !_.isEmpty(breadcrumbNames)) &&
                pathArray.map((p, index) => {
                    const to = `/${pathArray.slice(0, index + 1).join('/')}`;
                    const isLast = index === pathArray.length - 1;
                    const name = breadcrumbNames[p];
                    return (
                        <span key={index}>
                            {isLast ? (
                                name
                            ) : (
                                <>
                                    <Link href={to} className="hover:underline text-blue-600">
                                        {name}
                                    </Link>
                                    <span className="mx-2">/</span>
                                </>
                            )}
                        </span>
                    );
                })
            }
        </div>
    );
}
