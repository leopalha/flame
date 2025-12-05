/**
 * No-Show Check Job - FLAME Lounge Bar
 * Marca reservas como no-show 15 minutos após o horário
 */

const { Reservation } = require('../models');
const { Op } = require('sequelize');

/**
 * Verifica reservas que passaram do horário e marca como no-show
 * Executa a cada 15 minutos
 */
async function checkNoShows() {
  const startTime = Date.now();
  console.log(`[NO-SHOW] Iniciando verificação - ${new Date().toISOString()}`);

  try {
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    // Horário limite: 15 minutos atrás
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // Buscar reservas confirmadas de hoje que já passaram do horário
    const reservations = await Reservation.findAll({
      where: {
        status: 'confirmed',
        date: today
      }
    });

    // Filtrar reservas que já passaram 15 minutos do horário
    const noShowReservations = reservations.filter(r => {
      const reservationDateTime = new Date(`${r.date}T${r.time}`);
      return reservationDateTime < fifteenMinutesAgo;
    });

    console.log(`[NO-SHOW] Encontradas ${noShowReservations.length} reservas para marcar como no-show`);

    let markedCount = 0;

    for (const reservation of noShowReservations) {
      try {
        await reservation.update({
          status: 'no_show',
          notes: (reservation.notes || '') + `\n[Sistema] Marcado como no-show automaticamente em ${now.toISOString()}`
        });
        markedCount++;

        console.log(`[NO-SHOW] Reserva ${reservation.confirmationCode} marcada como no-show`);
      } catch (error) {
        console.error(`[NO-SHOW] Erro ao marcar reserva ${reservation.id}:`, error.message);
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[NO-SHOW] Concluído em ${duration}ms - ${markedCount} reservas marcadas`);

    return {
      success: true,
      markedCount,
      duration
    };
  } catch (error) {
    console.error('[NO-SHOW] Erro no job:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  name: 'noShow',
  schedule: '*/15 * * * *', // A cada 15 minutos
  handler: checkNoShows
};
