import { useState, useRef } from "react"
import type { Product, ProductsTableProps } from '../../types'

export const ProductsTable = ({
    products,
    token,
    createProduct,
    updateProduct,
    removeProduct,
    updatePhoto,
    removePhoto,
    getProducts,
    createTransaction,
}: ProductsTableProps) => {

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
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
    const [transactionQuantity, setTransactionQuantity] = useState<string>('')
    const [transactionCost, setTransactionCost] = useState<string>('')

    const handleCreate = async (): Promise<void> => {
        try {
            if (!name.trim()) {
                setError('Введите название продукта')
                return
            }
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
        if (!editName.trim()) {
            setError('Название продукта не может быть пустым')
            return
        }

        const duplicate = products.find(p =>
            p.name.toLowerCase() === editName.trim().toLowerCase() && p.id !== editingId
        )
        if (duplicate) {
            setError('Продукт с таким названием уже существует')
            return
        }

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

    const handleTransaction = async (type: 'purchase' | 'expense') => {
        if (!selectedProduct) return
        if (!transactionQuantity || Number(transactionQuantity) <= 0) {
            setError('Введите количество')
            return
        }
        try {
            await createTransaction(
                token,
                selectedProduct.id,
                type,
                Number(transactionQuantity),
                transactionCost ? Number(transactionCost) : undefined,
            )
            await getProducts(token)
            setTransactionQuantity('')
            setTransactionCost('')
            setSelectedProduct(null)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при сохранении транзакции')
        }
    }

    return (
        <div className="container mb-4">
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

                                <td
                                    onClick={() => setSelectedProduct(product)}
                                    onDoubleClick={() => startEditing(product)}
                                    style={{ cursor: 'pointer' }}
                                    className={`${product.min_quantity && Number(product.quantity) < Number(product.min_quantity) ? 'text-danger' : 'text-success'} ${selectedProduct?.id === product.id ? 'fw-bold' : ''}`}
                                >
                                    {editingId === product.id
                                        ? <input
                                            type="text"
                                            className="form-control"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                        />
                                        : product.name
                                    }
                                </td>

                                <td onDoubleClick={() => {
                                    setEditingPhotoId(product.id)
                                    fileInputRef.current?.click()
                                }}>
                                    {product.photo_url

                                        ? <div className="d-flex align-items-start gap-3" >

                                            <a href={product.photo_url} target="_blank" rel="noreferrer">
                                                <img src={product.photo_url} alt={product.name}
                                                    style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                            </a>

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
                        onChange={(e) => {
                            const newUnit = e.target.value as 'шт.' | 'кг' | 'л'
                            setUnit(newUnit)
                            if (newUnit === 'шт.') {
                                setQuantity(String(Math.floor(Number(quantity) || 0)))
                                setMinQuantity(String(Math.floor(Number(minQuantity) || 0)))
                            }
                        }}
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
                        step={unit === 'шт.' ? '1' : '0.01'}
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
                        step={unit === 'шт.' ? '1' : '0.01'}
                        min="0"
                        onChange={(e) => setMinQuantity(e.target.value)}
                    />
                </div>

                <button className="btn btn-success" onClick={handleCreate}>
                    Добавить
                </button>

            </div>

            {selectedProduct && (
                <div className="mt-4">
                    <h3 className="mb-3">Покупка / Расход: <span className="text-primary">{selectedProduct.name}</span></h3>
                    <div className="d-flex gap-4 align-items-end">
                        <div>
                            <label className="form-label">Количество</label>
                            <input
                                type="number"
                                className="form-control"
                                step="0.01"
                                min="0.01"
                                value={transactionQuantity}
                                onChange={(e) => setTransactionQuantity(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="form-label">Стоимость (необязательно)</label>
                            <input
                                type="number"
                                className="form-control"
                                step="0.01"
                                min="0"
                                value={transactionCost}
                                onChange={(e) => setTransactionCost(e.target.value)}
                            />
                        </div>
                        <button className="btn btn-success" onClick={() => handleTransaction('purchase')}>Покупка</button>
                        <button className="btn btn-warning" onClick={() => handleTransaction('expense')}>Расход</button>
                        <button className="btn btn-secondary" onClick={() => setSelectedProduct(null)}>Отмена</button>
                    </div>
                </div>
            )}

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