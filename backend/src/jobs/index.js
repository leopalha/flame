/**
 * Job Scheduler - FLAME Lounge Bar
 * Coordena todos os jobs agendados via node-cron
 */

const cron = require('node-cron');

// Import jobs
const stockAlertsJob = require('./stockAlerts.job');
const reservationReminderJob = require('./reservationReminder.job');
const noShowJob = require('./noShow.job');
const cashbackExpiryJob = require('./cashbackExpiry.job');
const dailyReportJob = require('./dailyReport.job');

// Lista de todos os jobs
const jobs = [
  stockAlertsJob,
  reservationReminderJob,
  noShowJob,
  cashbackExpiryJob,
  dailyReportJob
];

// Armazenar referências dos jobs ativos
const activeJobs = new Map();

// Log de execuções
const jobExecutionLog = [];
const MAX_LOG_ENTRIES = 100;

/**
 * Registra execução de um job no log
 */
function logExecution(jobName, result) {
  const entry = {
    job: jobName,
    timestamp: new Date().toISOString(),
    success: result.success,
    duration: result.duration,
    error: result.error || null,
    data: result.success ? {
      ...result,
      success: undefined,
      duration: undefined
    } : null
  };

  jobExecutionLog.unshift(entry);

  // Manter apenas as últimas N entradas
  if (jobExecutionLog.length > MAX_LOG_ENTRIES) {
    jobExecutionLog.pop();
  }
}

/**
 * Inicializa todos os jobs agendados
 */
function initializeJobs() {
  console.log('\n╔══════════════════════════════════════╗');
  console.log('║      🔥 FLAME Job Scheduler 🔥       ║');
  console.log('╠══════════════════════════════════════╣');

  jobs.forEach(job => {
    try {
      // Validar expressão cron
      if (!cron.validate(job.schedule)) {
        console.error(`║ ❌ ${job.name}: Expressão cron inválida`);
        return;
      }

      // Agendar job
      const scheduledJob = cron.schedule(job.schedule, async () => {
        try {
          const result = await job.handler();
          logExecution(job.name, result);
        } catch (error) {
          console.error(`[JOB-ERROR] ${job.name}:`, error);
          logExecution(job.name, {
            success: false,
            error: error.message,
            duration: 0
          });
        }
      }, {
        scheduled: true,
        timezone: 'America/Sao_Paulo'
      });

      activeJobs.set(job.name, scheduledJob);
      console.log(`║ ✅ ${job.name.padEnd(20)} ${job.schedule.padEnd(12)} ║`);
    } catch (error) {
      console.error(`║ ❌ Erro ao agendar ${job.name}:`, error.message);
    }
  });

  console.log('╠══════════════════════════════════════╣');
  console.log(`║ Total: ${jobs.length} jobs agendados             ║`);
  console.log('╚══════════════════════════════════════╝\n');

  return activeJobs.size;
}

/**
 * Para todos os jobs
 */
function stopAllJobs() {
  console.log('[JOBS] Parando todos os jobs...');
  activeJobs.forEach((job, name) => {
    job.stop();
    console.log(`[JOBS] ${name} parado`);
  });
  activeJobs.clear();
}

/**
 * Executa um job manualmente (para debug/admin)
 */
async function runJobManually(jobName) {
  const job = jobs.find(j => j.name === jobName);
  if (!job) {
    return {
      success: false,
      error: `Job '${jobName}' não encontrado`
    };
  }

  console.log(`[JOBS] Executando ${jobName} manualmente...`);
  try {
    const result = await job.handler();
    logExecution(jobName, { ...result, manual: true });
    return result;
  } catch (error) {
    const result = {
      success: false,
      error: error.message,
      duration: 0
    };
    logExecution(jobName, { ...result, manual: true });
    return result;
  }
}

/**
 * Retorna status de todos os jobs
 */
function getJobsStatus() {
  return jobs.map(job => ({
    name: job.name,
    schedule: job.schedule,
    active: activeJobs.has(job.name),
    lastExecutions: jobExecutionLog
      .filter(log => log.job === job.name)
      .slice(0, 5)
  }));
}

/**
 * Retorna log de execuções
 */
function getExecutionLog(limit = 50) {
  return jobExecutionLog.slice(0, limit);
}

/**
 * Lista nomes dos jobs disponíveis
 */
function getAvailableJobs() {
  return jobs.map(j => ({
    name: j.name,
    schedule: j.schedule,
    description: getJobDescription(j.name)
  }));
}

/**
 * Descrição dos jobs
 */
function getJobDescription(jobName) {
  const descriptions = {
    stockAlerts: 'Verifica estoque baixo e envia alertas (a cada hora)',
    reservationReminder: 'Envia lembretes 2h antes da reserva (a cada 30min)',
    noShow: 'Marca reservas como no-show após 15min (a cada 15min)',
    cashbackExpiry: 'Expira cashback após 90 dias de inatividade (diário 00h)',
    dailyReport: 'Gera relatório do dia anterior (diário 06h)'
  };
  return descriptions[jobName] || 'Sem descrição';
}

module.exports = {
  initializeJobs,
  stopAllJobs,
  runJobManually,
  getJobsStatus,
  getExecutionLog,
  getAvailableJobs,
  jobs
};
