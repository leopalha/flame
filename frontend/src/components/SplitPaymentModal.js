import { useState } from 'react';
import styles from './SplitPaymentModal.module.css';

export default function SplitPaymentModal({ order, onClose, onSplitCreated }) {
  const [splitType, setSplitType] = useState('equal'); // 'equal' | 'custom'
  const [participants, setParticipants] = useState(2);
  const [customSplits, setCustomSplits] = useState([
    { amount: 0 },
    { amount: 0 }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const total = parseFloat(order.total);

  // Calcular valor por pessoa (divisão igual)
  const amountPerPerson = (total / participants).toFixed(2);

  // Calcular total das divisões personalizadas
  const customTotal = customSplits.reduce((sum, s) => sum + parseFloat(s.amount || 0), 0);
  const customDifference = (total - customTotal).toFixed(2);

  const handleAddParticipant = () => {
    if (participants < 10) {
      setParticipants(participants + 1);
    }
  };

  const handleRemoveParticipant = () => {
    if (participants > 2) {
      setParticipants(participants - 1);
    }
  };

  const handleAddCustomSplit = () => {
    if (customSplits.length < 10) {
      setCustomSplits([...customSplits, { amount: 0 }]);
    }
  };

  const handleRemoveCustomSplit = (index) => {
    if (customSplits.length > 2) {
      const newSplits = customSplits.filter((_, i) => i !== index);
      setCustomSplits(newSplits);
    }
  };

  const handleCustomAmountChange = (index, value) => {
    const newSplits = [...customSplits];
    newSplits[index].amount = value;
    setCustomSplits(newSplits);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const payload = {
        splitType
      };

      if (splitType === 'equal') {
        payload.participants = participants;
      } else {
        // Validar soma
        if (Math.abs(customTotal - total) > 0.01) {
          setError(`Total das divisões (R$ ${customTotal.toFixed(2)}) deve ser igual ao total do pedido (R$ ${total.toFixed(2)})`);
          setLoading(false);
          return;
        }
        payload.splits = customSplits.map(s => ({
          amount: parseFloat(s.amount)
        }));
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao criar divisão');
      }

      if (onSplitCreated) {
        onSplitCreated(data.data);
      }

      onClose();
    } catch (err) {
      console.error('Erro ao criar divisão:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>Dividir Conta</h2>
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.orderInfo}>
            <div className={styles.infoRow}>
              <span>Pedido</span>
              <strong>#{order.orderNumber}</strong>
            </div>
            <div className={styles.infoRow}>
              <span>Subtotal</span>
              <span>R$ {parseFloat(order.subtotal).toFixed(2)}</span>
            </div>
            {order.serviceFee > 0 && (
              <div className={styles.infoRow}>
                <span>Taxa de Serviço</span>
                <span>R$ {parseFloat(order.serviceFee).toFixed(2)}</span>
              </div>
            )}
            {order.tipAmount > 0 && (
              <div className={styles.infoRow}>
                <span>Gorjeta</span>
                <span>R$ {parseFloat(order.tipAmount).toFixed(2)}</span>
              </div>
            )}
            <div className={`${styles.infoRow} ${styles.totalRow}`}>
              <strong>Total</strong>
              <strong>R$ {total.toFixed(2)}</strong>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Tipo de Divisão */}
            <div className={styles.splitTypeSelector}>
              <button
                type="button"
                className={splitType === 'equal' ? styles.active : ''}
                onClick={() => setSplitType('equal')}
              >
                Dividir Igualmente
              </button>
              <button
                type="button"
                className={splitType === 'custom' ? styles.active : ''}
                onClick={() => setSplitType('custom')}
              >
                Valores Diferentes
              </button>
            </div>

            {/* Divisão Igual */}
            {splitType === 'equal' && (
              <div className={styles.equalSplit}>
                <label>Número de pessoas</label>
                <div className={styles.participantControl}>
                  <button type="button" onClick={handleRemoveParticipant} disabled={participants <= 2}>
                    −
                  </button>
                  <input
                    type="number"
                    value={participants}
                    onChange={(e) => setParticipants(Math.max(2, Math.min(10, parseInt(e.target.value) || 2)))}
                    min="2"
                    max="10"
                  />
                  <button type="button" onClick={handleAddParticipant} disabled={participants >= 10}>
                    +
                  </button>
                </div>
                <div className={styles.perPersonAmount}>
                  <span>Cada pessoa paga:</span>
                  <strong>R$ {amountPerPerson}</strong>
                </div>
              </div>
            )}

            {/* Divisão Personalizada */}
            {splitType === 'custom' && (
              <div className={styles.customSplit}>
                <label>Valores Individuais</label>
                {customSplits.map((split, index) => (
                  <div key={index} className={styles.customSplitRow}>
                    <span>Pessoa {index + 1}</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={split.amount || ''}
                      onChange={(e) => handleCustomAmountChange(index, e.target.value)}
                      placeholder="0.00"
                    />
                    {customSplits.length > 2 && (
                      <button
                        type="button"
                        className={styles.removeButton}
                        onClick={() => handleRemoveCustomSplit(index)}
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
                {customSplits.length < 10 && (
                  <button
                    type="button"
                    className={styles.addButton}
                    onClick={handleAddCustomSplit}
                  >
                    + Adicionar Pessoa
                  </button>
                )}
                <div className={styles.customTotal}>
                  <div className={styles.infoRow}>
                    <span>Total inserido:</span>
                    <span>R$ {customTotal.toFixed(2)}</span>
                  </div>
                  <div className={`${styles.infoRow} ${parseFloat(customDifference) !== 0 ? styles.error : styles.success}`}>
                    <span>Diferença:</span>
                    <strong>R$ {customDifference}</strong>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className={styles.errorMessage}>
                {error}
              </div>
            )}

            <div className={styles.modalActions}>
              <button
                type="button"
                className={styles.cancelButton}
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.confirmButton}
                disabled={loading || (splitType === 'custom' && Math.abs(parseFloat(customDifference)) > 0.01)}
              >
                {loading ? 'Criando...' : 'Confirmar Divisão'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
