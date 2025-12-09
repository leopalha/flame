import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import styles from '../../styles/SplitStatus.module.css';

export default function SplitStatus() {
  const router = useRouter();
  const { orderId } = router.query;

  const [splitData, setSplitData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [selectedSplitId, setSelectedSplitId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');

  useEffect(() => {
    if (orderId) {
      fetchSplitStatus();
      // Atualizar a cada 5 segundos
      const interval = setInterval(fetchSplitStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchSplitStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/split`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao buscar status');
      }

      setSplitData(data.data);
      setError('');
    } catch (err) {
      console.error('Erro ao buscar status:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePaySplit = async (splitId) => {
    setPaymentLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/split/pay`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            splitId,
            paymentMethod
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao pagar');
      }

      // Atualizar dados
      await fetchSplitStatus();
      setSelectedSplitId(null);

      if (data.data.allPaid) {
        // Todos pagaram
        alert('Todos os pagamentos foram realizados! Pedido confirmado.');
        router.push('/pedidos');
      }
    } catch (err) {
      console.error('Erro ao pagar:', err);
      setError(err.message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleCancelSplit = async () => {
    if (!confirm('Tem certeza que deseja cancelar a divisão?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}/split`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erro ao cancelar');
      }

      alert('Divisão cancelada com sucesso');
      router.push(`/pedidos`);
    } catch (err) {
      console.error('Erro ao cancelar:', err);
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Carregando...</div>
      </div>
    );
  }

  if (error && !splitData) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => router.back()} className={styles.backButton}>
          Voltar
        </button>
      </div>
    );
  }

  const progressPercentage = parseFloat(splitData.percentage);
  const currentUserId = typeof window !== 'undefined' ? localStorage.getItem('userId') : null;
  const myParticipation = splitData.participants.find(p => p.userId === currentUserId);

  return (
    <>
      <Head>
        <title>Divisão de Conta - Pedido #{splitData.orderNumber}</title>
      </Head>

      <div className={styles.container}>
        <div className={styles.header}>
          <button onClick={() => router.back()} className={styles.backButton}>
            ← Voltar
          </button>
          <h1>Divisão de Conta</h1>
          <div className={styles.orderNumber}>Pedido #{splitData.orderNumber}</div>
        </div>

        {/* Progress Bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressBar}>
            <div
              className={styles.progressFill}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className={styles.progressLabel}>
            {progressPercentage.toFixed(0)}% Pago
          </div>
        </div>

        {/* Resumo */}
        <div className={styles.summary}>
          <div className={styles.summaryRow}>
            <span>Total do Pedido</span>
            <strong>R$ {splitData.total.toFixed(2)}</strong>
          </div>
          <div className={styles.summaryRow}>
            <span>Já Pago</span>
            <span className={styles.paidAmount}>R$ {splitData.paid.toFixed(2)}</span>
          </div>
          <div className={styles.summaryRow}>
            <span>Restante</span>
            <span className={styles.remainingAmount}>R$ {splitData.remaining.toFixed(2)}</span>
          </div>
        </div>

        {/* Minha Participação */}
        {myParticipation && (
          <div className={styles.myParticipation}>
            <h3>Minha Parte</h3>
            <div className={styles.myAmount}>
              R$ {parseFloat(myParticipation.amount).toFixed(2)}
            </div>
            <div className={styles.myStatus}>
              {myParticipation.status === 'paid' ? (
                <span className={styles.statusPaid}>✓ Pago</span>
              ) : (
                <>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className={styles.paymentMethodSelect}
                  >
                    <option value="credit">Cartão de Crédito</option>
                    <option value="debit">Cartão de Débito</option>
                    <option value="pix">PIX</option>
                    <option value="cash">Dinheiro</option>
                    <option value="card_at_table">Cartão na Mesa</option>
                  </select>
                  <button
                    onClick={() => handlePaySplit(myParticipation.id)}
                    disabled={paymentLoading}
                    className={styles.payButton}
                  >
                    {paymentLoading ? 'Processando...' : 'Pagar Minha Parte'}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Lista de Participantes */}
        <div className={styles.participants}>
          <h3>Participantes ({splitData.paidCount}/{splitData.totalParticipants})</h3>
          {splitData.participants.map((participant, index) => (
            <div
              key={participant.id}
              className={`${styles.participantCard} ${
                participant.status === 'paid' ? styles.participantPaid : ''
              }`}
            >
              <div className={styles.participantInfo}>
                <div className={styles.participantName}>
                  {participant.userName || `Pessoa ${index + 1}`}
                </div>
                <div className={styles.participantAmount}>
                  R$ {parseFloat(participant.amount).toFixed(2)}
                  <span className={styles.participantPercentage}>
                    ({parseFloat(participant.percentage).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className={styles.participantStatus}>
                {participant.status === 'paid' ? (
                  <>
                    <span className={styles.statusBadge}>✓ Pago</span>
                    {participant.paymentMethod && (
                      <span className={styles.paymentMethodBadge}>
                        {participant.paymentMethod}
                      </span>
                    )}
                  </>
                ) : (
                  <span className={styles.statusBadge}>⏳ Pendente</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Status Completo */}
        {splitData.isComplete && (
          <div className={styles.completeMessage}>
            <div className={styles.completeIcon}>✓</div>
            <h3>Pagamento Completo!</h3>
            <p>Todos os participantes pagaram suas partes.</p>
          </div>
        )}

        {/* Ações */}
        {!splitData.isComplete && splitData.paidCount === 0 && (
          <div className={styles.actions}>
            <button onClick={handleCancelSplit} className={styles.cancelButton}>
              Cancelar Divisão
            </button>
          </div>
        )}

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
    </>
  );
}
