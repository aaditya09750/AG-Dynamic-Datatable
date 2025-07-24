"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Loader2,
} from "lucide-react"

interface Artwork {
  id: number
  title: string
  place_of_origin: string
  artist_display: string
  inscriptions: string
  date_start: number
  date_end: number
}

interface ApiResponse {
  data: Artwork[]
  pagination: {
    total: number
    limit: number
    offset: number
    total_pages: number
    current_page: number
  }
}

interface BulkSelectionState {
  totalRequested: number
  remainingToSelect: number
  isActive: boolean
}

export default function ArtworkDataTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [loading, setLoading] = useState(false)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedArtworks, setSelectedArtworks] = useState<Set<number>>(new Set())
  const [bulkSelection, setBulkSelection] = useState<BulkSelectionState>({
    totalRequested: 0,
    remainingToSelect: 0,
    isActive: false,
  })
  const [bulkSelectCount, setBulkSelectCount] = useState<string>("")
  const [showBulkPanel, setShowBulkPanel] = useState(false)
  const bulkPanelRef = useRef<HTMLDivElement>(null)
  const rowsPerPage = 12

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://api.artic.edu/api/v1/artworks?page=${currentPage}&limit=${rowsPerPage}`
        )
        const json: ApiResponse = await res.json()
        setArtworks(json.data || [])
        setTotalRecords(json.pagination?.total || 0)
        setTotalPages(json.pagination?.total_pages || 0)

        if (bulkSelection.isActive && bulkSelection.remainingToSelect > 0) {
          applyBulkSelectionToPage(json.data)
        }
      } catch (err) {
        console.error("Failed to fetch artworks:", err)
      } finally {
        setLoading(false)
      }
    }

    loadPage()
  }, [currentPage])

  useEffect(() => {
    const clickAway = (e: MouseEvent) => {
      if (bulkPanelRef.current && !bulkPanelRef.current.contains(e.target as Node)) {
        setShowBulkPanel(false)
      }
    }
    document.addEventListener("mousedown", clickAway)
    return () => document.removeEventListener("mousedown", clickAway)
  }, [])

  const applyBulkSelectionToPage = (pageItems: Artwork[]) => {
    if (bulkSelection.remainingToSelect <= 0) return
    const updated = new Set(selectedArtworks)
    let added = 0
    for (const art of pageItems) {
      if (added >= bulkSelection.remainingToSelect) break
      if (!updated.has(art.id)) {
        updated.add(art.id)
        added++
      }
    }
    setSelectedArtworks(updated)
    const remaining = Math.max(0, bulkSelection.remainingToSelect - added)
    setBulkSelection((prev) => ({ ...prev, remainingToSelect: remaining, isActive: remaining > 0 }))
  }

  const handleSelection = (id: number, checked: boolean) => {
    const updated = new Set(selectedArtworks)
    checked ? updated.add(id) : updated.delete(id)
    setSelectedArtworks(updated)
    if (!checked && bulkSelection.isActive) {
      setBulkSelection((prev) => ({ ...prev, remainingToSelect: Math.max(0, prev.remainingToSelect - 1) }))
    }
  }

  const toggleAllOnPage = () => {
    const updated = new Set(selectedArtworks)
    const ids = artworks.map((a) => a.id)
    const allSelected = ids.every((id) => selectedArtworks.has(id))
    ids.forEach((id) => (allSelected ? updated.delete(id) : updated.add(id)))
    if (bulkSelection.isActive && allSelected) {
      const deselected = ids.filter((id) => selectedArtworks.has(id)).length
      setBulkSelection((prev) => ({ ...prev, remainingToSelect: Math.max(0, prev.remainingToSelect - deselected) }))
    }
    setSelectedArtworks(updated)
  }

  const onBulkSelect = () => {
    const count = Number.parseInt(bulkSelectCount)
    if (!count || count <= 0) return
    const updated = new Set(selectedArtworks)
    const limit = Math.min(count, artworks.length)
    for (let i = 0; i < limit; i++) updated.add(artworks[i].id)
    setSelectedArtworks(updated)
    setBulkSelection({ totalRequested: count, remainingToSelect: count - limit, isActive: count - limit > 0 })
    setBulkSelectCount("")
    setShowBulkPanel(false)
  }

  const clearSelections = () => {
    setSelectedArtworks(new Set())
    setBulkSelection({ totalRequested: 0, remainingToSelect: 0, isActive: false })
  }

  const formatDate = (art: Artwork) => {
    return art.date_start === art.date_end
      ? art.date_start.toString()
      : `${art.date_start} - ${art.date_end}`
  }

  const truncate = (text: string, limit = 50) => {
    return !text ? "—" : text.length > limit ? `${text.slice(0, limit)}...` : text
  }

  const statusText = () => {
    const total = selectedArtworks.size
    const current = artworks.filter((a) => selectedArtworks.has(a.id)).length
    if (bulkSelection.isActive && bulkSelection.remainingToSelect > 0) {
      return `${total} selected (${bulkSelection.remainingToSelect} more pending)`
    }
    return total === current ? `${total} selected on this page` : `${total} selected total (${current} this page)`
  }

  const pagination = () => (
    <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="sm" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
          <ChevronsLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-sm font-medium">Page {currentPage} of {totalPages}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(totalPages)}
          disabled={currentPage === totalPages}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 text-black">Artwork Collection</h1>
        <p className="text-gray-600">Explore highlights from the Art Institute of Chicago’s collection</p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Artworks</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="relative flex items-center">
                  <Checkbox
                    checked={artworks.every((a) => selectedArtworks.has(a.id))}
                    onCheckedChange={toggleAllOnPage}
                    className="mr-2"
                    data-state={
                      artworks.some((a) => selectedArtworks.has(a.id)) &&
                      !artworks.every((a) => selectedArtworks.has(a.id))
                        ? "indeterminate"
                        : undefined
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 w-8 p-0 bg-transparent"
                    onClick={() => setShowBulkPanel(!showBulkPanel)}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>

                  {showBulkPanel && (
                    <div
                      ref={bulkPanelRef}
                      className="absolute top-full right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-10 p-4"
                    >
                      <h3 className="text-lg font-semibold mb-4">Bulk Selection</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Number of rows to select:
                          </label>
                          <Input
                            type="number"
                            value={bulkSelectCount}
                            onChange={(e) => setBulkSelectCount(e.target.value)}
                            min={1}
                            max={totalRecords}
                            placeholder="Enter number of rows"
                          />
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Page has {artworks.length} artworks.</p>
                          <p>Remaining items will be selected automatically as you move through pages.</p>
                          <p className="font-medium">Manual deselections are retained.</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={onBulkSelect}
                            disabled={!bulkSelectCount || Number.parseInt(bulkSelectCount) <= 0}
                            className="flex-1"
                          >
                            Select
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setBulkSelectCount("")
                              setShowBulkPanel(false)
                            }}
                            className="flex-1"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <span className="text-sm text-gray-600">{statusText()}</span>
                {selectedArtworks.size > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSelections}
                    className="text-red-600 hover:text-red-700 bg-transparent"
                  >
                    Clear All
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading artworks...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12" />
                    <TableHead className="min-w-[200px]">Title</TableHead>
                    <TableHead className="min-w-[200px]">Artist</TableHead>
                    <TableHead className="min-w-[150px]">Origin</TableHead>
                    <TableHead className="min-w-[150px]">Inscriptions</TableHead>
                    <TableHead className="min-w-[120px]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {artworks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No artworks found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    artworks.map((art) => (
                      <TableRow key={art.id} className="hover:bg-gray-50">
                        <TableCell>
                          <Checkbox
                            checked={selectedArtworks.has(art.id)}
                            onCheckedChange={(checked) => handleSelection(art.id, checked as boolean)}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="font-medium" title={art.title}>{truncate(art.title || "Untitled")}</div>
                        </TableCell>
                        <TableCell>
                          <div title={art.artist_display}>{truncate(art.artist_display || "Unknown Artist")}</div>
                        </TableCell>
                        <TableCell>
                          <div title={art.place_of_origin}>{truncate(art.place_of_origin || "Unknown")}</div>
                        </TableCell>
                        <TableCell>
                          <div title={art.inscriptions}>{truncate(art.inscriptions || "None")}</div>
                        </TableCell>
                        <TableCell>{formatDate(art)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              {pagination()}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
