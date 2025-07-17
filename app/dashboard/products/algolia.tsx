"use client"

import { useMemo, useRef, useState } from "react"
import { InstantSearchNext } from "react-instantsearch-nextjs"
import { SearchBox, Hits, Highlight } from "react-instantsearch"
import { searchClient as originalSearchClient } from "@/lib/algolia-client"
import Link from "next/link"
import Image from "next/image"
import { Card } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"
import type { Hit as AlgoliaHit } from "instantsearch.js"
import type { SearchClient } from "instantsearch.js"

// ✅ Fix search client type issue
const searchClient = {
  ...originalSearchClient,
  getRecommendations: undefined,
} as unknown as SearchClient

// ✅ Correct hit type
type ProductHit = AlgoliaHit<{
  id: string
  price: number
  title: string
  productType: string
  variantImages: string[]
}>

function Hit({ hit }: { hit: ProductHit }) {
  return (
    <div className="p-4 mb-2 hover:bg-secondary">
      <Link
        href={`/products/${hit.objectID}?id=${hit.objectID}&productID=${hit.id}&price=${hit.price}&title=${hit.title}&type=${hit.productType}&image=${hit.variantImages[0]}&variantID=${hit.objectID}`}
      >
        <div className="flex w-full gap-12 items-center justify-between">
          <Image
            src={hit.variantImages[0]}
            alt={hit.title}
            width={60}
            height={60}
          />
          <Highlight attribute="title" hit={hit} />
          <Highlight attribute="productType" hit={hit} />
          <p className="font-medium">${hit.price}</p>
        </div>
      </Link>
    </div>
  )
}

export default function AlgoliaSearch() {
  const [active, setActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // ✅ Updated per Framer Motion deprecation
  const MCard = useMemo(() => motion.create(Card), [])

  return (
    <InstantSearchNext
      future={{
        persistHierarchicalRootCount: true,
        preserveSharedStateOnUnmount: true,
      }}
      indexName="products"
      searchClient={searchClient}
    >
      <div
        className="relative"
        onFocus={() => setActive(true)}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setActive(false)
          }
        }}
        tabIndex={-1}
        ref={containerRef}
      >
        <SearchBox
          classNames={{
            input:
              "h-full w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            submitIcon: "hidden",
            form: "relative mb-4",
            resetIcon: "hidden",
          }}
        />
        <AnimatePresence>
          {active && (
            <MCard
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute w-full z-50 overflow-y-scroll h-96"
            >
              <Hits hitComponent={Hit} classNames={{ root: "rounded-md" }} />
            </MCard>
          )}
        </AnimatePresence>
      </div>
    </InstantSearchNext>
  )
}
