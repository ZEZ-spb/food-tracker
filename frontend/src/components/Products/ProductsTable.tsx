import { useState, useRef } from "react"
import type { Product, ProductsTableProps } from '../../types'

export const ProductsTable = ({ products, token, createProduct, updateProduct, removeProduct,
    updatePhoto, removePhoto, getProducts }: ProductsTableProps) => {

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [name, setName] = useState('')
    const [unit, setUnit] = useState<'шт.' | 'кг' | 'л'>('кг')
    const [quantity, setQuantity] = useState<string>('')
    const [minQuantity, setMinQuantity] = useState<string>('')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editName, setEditName] = useState('')
    const [editUnit, setEditUnit] = useState<'шт.' | 'кг' | 'л'>('шт.')
    const [editQuantity, setEditQuantity] = useState<string>('')
    const [editMinQuantity, setEditMinQuantity] = useState<string>('')
    const [editingPhotoId, setEditingPhotoId] = useState<number | null>(null)
    const [error, setError] = useState<string>('')

    const handleCreate = async (): Promise<void> => {
        try {
            await createProduct(token, name, unit, Number(quantity) || 0, Number(minQuantity) || null)
            setName('')
            setUnit('шт.')
            setQuantity('')
            setMinQuantity('')
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при добавлении продукта')
        }
    }

    const startEditing = (product: Product) => {
        setEditingId(product.id)
        setEditName(product.name)
        setEditUnit(product.unit)
        setEditQuantity(String(product.quantity))
        setEditMinQuantity(product.min_quantity !== null ? String(product.min_quantity) : '')
    }

    const cancelEditing = () => {
        setEditingId(null)
    }

    const handleUpdate = async (): Promise<void> => {
    try {
        await updateProduct(token, editingId!, editName, editUnit, Number(editQuantity) || 0, Number(editMinQuantity) || null)
        setEditingId(null)
    } catch (err: any) {
        setError(err.response?.data?.message || 'Ошибка при обновлении продукта')
    }
}

    const handleRemove = async (): Promise<void> => {
        try {
            await removeProduct(token, editingId!)
            setEditingId(null)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при удалении продукта')
        }
    }

    const handleUpdatePhoto = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
        const file = e.target.files?.[0]
        if (!file || !editingPhotoId) return
        try {
            await updatePhoto(token, editingPhotoId, file)
            await getProducts(token)
            e.target.value = ''
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при обновлении фото')
        }
    }

    const handleRemovePhoto = async (photoId: number): Promise<void> => {
        try {
            await removePhoto(token, photoId)
            await getProducts(token)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при удалении фото')
        }
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-2">Продукты</h2>

            {error && (
                <div className="alert alert-danger alert-dismissible" role="alert">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')} />
                </div>
            )}

            <table className="table table-bordered">
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Фото</th>
                        <th>Количество</th>
                        <th>Норма</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map(product =>
                            <tr key={product.id}>

                                <td onDoubleClick={() => startEditing(product)}>
                                    {editingId === product.id
                                        ? <input
                                            type="text"
                                            className="form-control"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                        : <div className={product.min_quantity && product.quantity < product.min_quantity
                                            ? 'text-danger' : 'text-success'}>
                                            {product.name}
                                        </div>
                                    }
                                </td>

                                <td onDoubleClick={() => {
                                    setEditingPhotoId(product.id)
                                    fileInputRef.current?.click()
                                }}>
                                    {product.photo_url

                                        ? <div className="d-flex align-items-start gap-3" >
                                            <img src={product.photo_url} alt={product.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }} />

                                            <button className="btn btn-danger btn-sm p-0 px-1" onClick={() => {
                                                handleRemovePhoto(product.id)
                                            }}>
                                                X
                                            </button>

                                        </div>

                                        : <button className="btn btn-outline-secondary btn-sm" onClick={() => {
                                            setEditingPhotoId(product.id)
                                            fileInputRef.current?.click()
                                        }}>
                                            Добавить фото
                                        </button>
                                    }
                                </td>

                                <td onDoubleClick={() => startEditing(product)}>
                                    {editingId === product.id
                                        ? <input
                                            type="number"
                                            className="form-control"
                                            value={editQuantity}
                                            step="0.01"
                                            min="0"
                                            onChange={(e) => setEditQuantity(e.target.value)}
                                        />
                                        :
                                        <div className={product.min_quantity && product.quantity < product.min_quantity
                                            ? 'text-danger' : 'text-success'}>
                                            {product.quantity} {product.unit}
                                        </div>
                                    }
                                </td>

                                <td onDoubleClick={() => startEditing(product)}>
                                    {editingId === product.id
                                        ? <input
                                            type="number"
                                            className="form-control"
                                            value={editMinQuantity}
                                            step="0.01"
                                            min="0"
                                            onChange={(e) => setEditMinQuantity(e.target.value)}
                                        />
                                        : product.min_quantity ? `${product.min_quantity} ${product.unit}` : '—'
                                    }
                                </td>

                                <td>
                                    {editingId === product.id && (
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-success btn-sm" onClick={handleUpdate}>
                                                Сохранить
                                            </button>
                                            <button className="btn btn-danger btn-sm" onClick={handleRemove}>
                                                Удалить
                                            </button>
                                            <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>
                                                Отмена
                                            </button>
                                        </div>
                                    )}
                                </td>

                            </tr>
                        )
                    }
                </tbody>
            </table>

            <h3 className="mb-1 mt-3">Введите новый продукт</h3>

            <div className="d-flex gap-4 align-items-end">

                <div>
                    <label className="form-label">Название</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div>
                    <label className="form-label">Единица измерения</label>
                    <select
                        className="form-select"
                        value={unit}
                        onChange={(e) => setUnit(e.target.value as 'шт.' | 'кг' | 'л')}
                    >
                        <option value="шт.">шт.</option>
                        <option value="кг">кг</option>
                        <option value="л">л</option>
                    </select>
                </div>

                <div>
                    <label className="form-label">Количество</label>
                    <input
                        type="number"
                        className="form-control"
                        value={quantity}
                        step="0.01"
                        min="0"
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>

                <div>
                    <label className="form-label">Минимум</label>
                    <input
                        type="number"
                        className="form-control"
                        value={minQuantity}
                        step="0.01"
                        min="0"
                        onChange={(e) => setMinQuantity(e.target.value)}
                    />
                </div>

                <button className="btn btn-success" onClick={handleCreate}>
                    Добавить
                </button>

            </div>
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/jpeg,image/png,image/webp"
                onChange={handleUpdatePhoto}
            />
        </div>
    )
}