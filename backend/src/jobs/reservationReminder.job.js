/**
 * Reservation Reminder Job - FLAME Lounge Bar
 * Envia lembretes de reserva 2 horas antes
 */

const { Reservation, User } = require('../models');
const pushService = require('../services/push.service');
const smsService = require('../services/sms.service');
const { Op } = require('sequelize');

/**
 * Envia lembretes para reservas que acontecerão em 2 horas
 * Executa a cada 30 minutos
 */
async function sendReservationReminders() {
  const startTime = Date.now();
  console.log(`[RESERVATION-REMINDER] Iniciando envio de lembretes - ${new Date().toISOString()}`);

  try {
    const now = new Date();
    const twoHoursLater = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    const twoHoursAndHalfLater = new Date(now.getTime() + 2.5 * 60 * 60 * 1000);

    // Buscar reservas confirmadas que acontecerão em ~2 horas e ainda não receberam lembrete
    const reservations = await Reservation.findAll({
      where: {
        status: 'confirmed',
        reminderSent: false,
        date: {
          [Op.gte]: now.toISOString().split('T')[0],
          [Op.lte]: now.toISOString().split('T')[0]
        }
      },
      include: [{
        model: User,
        as: 'user',
        attributes: ['id', 'nome', 'celular', 'email']
      }]
    });

    // Filtrar reservas dentro da janela de 2h
    const reservationsToRemind = reservations.filter(r => {
      const reservationDateTime = new Date(`${r.date}T${r.time}`);
      return reservationDateTime >= twoHoursLater && reservationDateTime < twoHoursAndHalfLater;
    });

    console.log(`[RESERVATION-REMINDER] Encontradas ${reservationsToRemind.length} reservas para lembrete`);

    let sentCount = 0;
    let failedCount = 0;

    for (const reservation of reservationsToRemind) {
      try {
        const user = reservation.user;
        if (!user) continue;

        const message = `Olá ${user.nome}! Lembrete: sua reserva no FLAME para ${reservation.guests} pessoas está marcada para hoje às ${reservation.time}. Código: ${reservation.confirmationCode}`;

        // Enviar Push Notification
        try {
          await pushService.sendToUser(user.id, {
            title: '🔔 Lembrete de Reserva - FLAME',
            body: `Sua reserva para ${reservation.guests} pessoas é hoje às ${reservation.time}`,
            icon: '/icons/icon-192x192.png',
            tag: `reservation-${reservation.id}`,
            data: {
              type: 'reservation_reminder',
              reservationId: reservation.id,
              url: '/reservas'
            }
          });
        } catch (pushError) {
          console.log(`[RESERVATION-REMINDER] Push falhou para ${user.id}:`, pushError.message);
        }

        // Enviar SMS se Twilio estiver configurado
        if (user.celular && smsService.enabled) {
          try {
            await smsService.sendVerificationCode(user.celular, message);
          } catch (smsError) {
            console.log(`[RESERVATION-REMINDER] SMS falhou para ${user.celular}:`, smsError.message);
          }
        }

        // Marcar lembrete como enviado
        await reservation.update({ reminderSent: true });
        sentCount++;

        console.log(`[RESERVATION-REMINDER] Lembrete enviado para ${user.nome} - Reserva ${reservation.confirmationCode}`);
      } catch (error) {
        console.error(`[RESERVATION-REMINDER] Erro ao processar reserva ${reservation.id}:`, error.message);
        failedCount++;
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[RESERVATION-REMINDER] Concluído em ${duration}ms - ${sentCount} enviados, ${failedCount} falharam`);

    return {
      success: true,
      sentCount,
      failedCount,
      duration
    };
  } catch (error) {
    console.error('[RESERVATION-REMINDER] Erro no job:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  name: 'reservationReminder',
  schedule: '*/30 * * * *', // A cada 30 minutos
  handler: sendReservationReminders
};
