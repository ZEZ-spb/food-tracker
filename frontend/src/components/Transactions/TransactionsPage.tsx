import { useState, useEffect } from 'react'
import type { Transaction, TransactionsPageProps } from '../../types'
import React from 'react'

export const TransactionsPage = ({ transactions, token, getTransactions,
    removeTransaction, updateTransaction,
    currency }: TransactionsPageProps) => {
    const [period, setPeriod] = useState<'1m' | '3m' | '6m' | '1y'>('1m')
    const [editingId, setEditingId] = useState<number | null>(null)
    const [editQuantity, setEditQuantity] = useState<string>('')
    const [editCost, setEditCost] = useState<string>('')
    const [error, setError] = useState<string>('')

    useEffect(() => {
        getTransactions(token, period)
    }, [period])

    const purchases = transactions.filter(t => t.type === 'purchase')
    const expenses = transactions.filter(t => t.type === 'expense' || t.type === 'adjustment')

    const groupByProduct = (items: Transaction[]) => {
        const groups: { [key: number]: Transaction[] } = {}
        items.forEach(t => {
            if (!groups[t.product_id]) groups[t.product_id] = []
            groups[t.product_id].push(t)
        })
        return groups
    }

    const purchaseGroups = groupByProduct(purchases)
    const expenseGroups = groupByProduct(expenses)

    const startEditing = (t: Transaction) => {
        setEditingId(t.id)
        setEditQuantity(String(Math.abs(Number(t.quantity_delta))))
        setEditCost(t.cost ? String(t.cost) : '')
    }

    const cancelEditing = () => setEditingId(null)

    const handleUpdate = async (): Promise<void> => {
        try {
            await updateTransaction(
                token, 
                editingId!, 
                Number(editQuantity) || 0,
                editCost !== '' ? Number(editCost) : null,
//                editCost !== '' ? currency as 'ILS' | 'EUR' | 'USD' | 'RUB' : null
            )
            await getTransactions(token, period)
            setEditingId(null)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при обновлении транзакции')
        }
    }

    const handleRemove = async (): Promise<void> => {
        try {
            await removeTransaction(token, editingId!)
            await getTransactions(token, period)
            setEditingId(null)
        } catch (err: any) {
            setError(err.response?.data?.message || 'Ошибка при удалении транзакции')
        }
    }

    return (
        <div className="container mt-4">
            <h2>Покупки и расход</h2>

            {error && <div className="alert alert-danger alert-dismissible" role="alert">
                {error}
                <button type="button" className="btn-close" onClick={() => setError('')} />
            </div>}

            <div className="d-flex gap-2 mb-4">
                {(['1m', '3m', '6m', '1y'] as const).map(p => (
                    <button
                        key={p}
                        className={`btn ${period === p ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setPeriod(p)}
                    >
                        {p === '1m' ? '1 месяц' : p === '3m' ? '3 месяца' : p === '6m' ? '6 месяцев' : '1 год'}
                    </button>
                ))}
            </div>

            {/* <p>Всего транзакций: {transactions.length}</p>
            <p>Покупок: {purchases.length}</p>
            <p>Расходов: {expenses.length}</p> */}

            <h3 className="mt-4">Покупки за {period === '1m' ? '1 месяц' : period === '3m' ? '3 месяца' : period === '6m' ? '6 месяцев' : '1 год'}</h3>
            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>Продукт</th>
                        <th>Дата</th>
                        <th>Количество</th>
                        <th>Стоимость</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(purchaseGroups).map(([productId, items]) => (
                        <React.Fragment key={productId}>

                            {items.map((t, index) => (
                                <tr key={t.id} onDoubleClick={() => startEditing(t)} style={{ cursor: 'pointer' }}>
                                    {index === 0 && <td rowSpan={items.length}>{t.product.name}</td>}
                                    <td>{new Date(t.created_at).toLocaleDateString('ru-RU')}</td>
                                    <td>
                                        {editingId === t.id
                                            ? <input type="number" className="form-control" value={editQuantity}
                                                step="0.01" min="0.01"
                                                onChange={(e) => setEditQuantity(e.target.value)} />
                                            : `${Math.abs(Number(t.quantity_delta))} ${t.product.unit}`
                                        }
                                    </td>
                                    <td>
                                        {editingId === t.id
                                            ? <input type="number" className="form-control" value={editCost}
                                                step="0.01" min="0"
                                                onChange={(e) => setEditCost(e.target.value)} />
                                            // : t.cost && t.currency === currency ? `${t.cost} ${t.currency}` : '—'
                                            : t.cost ? `${t.cost}` : '—'
                                        }
                                    </td>
                                </tr>
                            ))}

                            {editingId && items.find(t => t.id === editingId) && (
                                <tr>
                                    <td></td>
                                    <td colSpan={3}>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-success btn-sm" onClick={handleUpdate}>Сохранить</button>
                                            <button className="btn btn-danger btn-sm" onClick={handleRemove}>Удалить</button>
                                            <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Отмена</button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            <tr key={`total-${productId}`} className="table-secondary fw-bold">
                                <td></td>
                                <td>За период</td>
                                <td>{items.reduce((sum, t) => sum + Math.abs(Number(t.quantity_delta)), 0).toFixed(2)} {items[0].product.unit}</td>
                                <td>
                                    {/* {items.reduce((sum, t) => sum + (t.currency === currency ? Number(t.cost || 0) : 0), 0).toFixed(2)} {currency} */}
                                    {items.reduce((sum, t) => sum + (Number(t.cost || 0)), 0).toFixed(2)} {currency}
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}

                    <tr className="table-dark fw-bold">
                        <td colSpan={3} className="text-end">Итого за период:</td>
                        <td>
                            {/* {purchases.reduce((sum, t) => sum + (t.currency === currency ? Number(t.cost || 0) : 0), 0).toFixed(2)} {currency} */}
                            {purchases.reduce((sum, t) => sum + (Number(t.cost || 0)), 0).toFixed(2)} {currency}
                        </td>
                    </tr>

                </tbody>

            </table>

            <h3 className="mt-4">Расход за {period === '1m' ? '1 месяц' : period === '3m' ? '3 месяца' : period === '6m' ? '6 месяцев' : '1 год'}</h3>
            <table className="table table-bordered">

                <thead>
                    <tr>
                        <th>Продукт</th>
                        <th>Дата</th>
                        <th>Количество</th>
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(expenseGroups).map(([productId, items]) => (
                        <React.Fragment key={productId}>
                            {items.map((t, index) => (

                                < tr key={t.id} onDoubleClick={() => startEditing(t)} style={{ cursor: 'pointer' }}>
                                    {index === 0 && <td rowSpan={items.length}>{t.product.name}</td>}
                                    <td>{new Date(t.created_at).toLocaleDateString('ru-RU')}</td>
                                    <td>
                                        {editingId === t.id
                                            ? <input type="number" className="form-control" value={editQuantity}
                                                step="0.01" min="0.01"
                                                onChange={(e) => setEditQuantity(e.target.value)} />
                                            : `${Math.abs(Number(t.quantity_delta))} ${t.product.unit}`
                                        }
                                    </td>

                                </tr >

                            ))}

                            {editingId && items.find(t => t.id === editingId) && (
                                <tr>
                                    <td></td>
                                    <td colSpan={3}>
                                        <div className="d-flex gap-2">
                                            <button className="btn btn-success btn-sm" onClick={handleUpdate}>Сохранить</button>
                                            <button className="btn btn-danger btn-sm" onClick={handleRemove}>Удалить</button>
                                            <button className="btn btn-secondary btn-sm" onClick={cancelEditing}>Отмена</button>
                                        </div>
                                    </td>
                                </tr>
                            )}

                            <tr key={`total-${productId}`} className="table-secondary fw-bold">
                                <td></td>
                                <td>За период</td>
                                <td>{items.reduce((sum, t) => sum + Math.abs(Number(t.quantity_delta)), 0).toFixed(2)} {items[0].product.unit}</td>
                            </tr>
                        </React.Fragment>
                    ))}

                </tbody>

            </table>

        </div >
    )
}