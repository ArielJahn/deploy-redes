const http = require('http');
const os = require('os');

const port = process.env.PORT || 3000;

function getServerInfo() {
  const interfaces = os.networkInterfaces();
  const ipAddresses = [];

  Object.values(interfaces).forEach((networkList) => {
    networkList.forEach((details) => {
      if (details.family === 'IPv4' && !details.internal) {
        ipAddresses.push(details.address);
      }
    });
  });

  return {
    app: 'aws-server-info-app',
    status: 'online',
    timestamp: new Date().toISOString(),
    server: {
      hostname: os.hostname(),
      platform: process.platform,
      release: os.release(),
      arch: os.arch(),
      uptimeSeconds: Math.round(os.uptime()),
      totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
      freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
      cpuCount: os.cpus().length,
      cpuModel: os.cpus()[0]?.model || 'Desconhecido',
      ipAddresses: [...new Set(ipAddresses)]
    },
    process: {
      pid: process.pid,
      nodeVersion: process.version,
      memoryUsageMb: Math.round(process.memoryUsage().rss / 1024 / 1024)
    },
    environment: {
      port: Number(port),
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  };
}

function renderHtml(info) {
  const rows = [
    ['Hostname', info.server.hostname],
    ['Plataforma', info.server.platform],
    ['Versão do sistema', info.server.release],
    ['Arquitetura', info.server.arch],
    ['Uptime', `${info.server.uptimeSeconds} segundos`],
    ['Memória total', `${info.server.totalMemoryMb} MB`],
    ['Memória livre', `${info.server.freeMemoryMb} MB`],
    ['CPUs', String(info.server.cpuCount)],
    ['Modelo da CPU', info.server.cpuModel],
    ['IP público/local', info.server.ipAddresses.join(', ') || 'N/A'],
    ['Node.js', info.process.nodeVersion],
    ['PID', String(info.process.pid)]
  ];

  const tableHtml = rows
    .map(([label, value]) => `<tr><th>${label}</th><td>${value}</td></tr>`)
    .join('');

  return `<!doctype html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AWS Test App</title>
      <style>
        :root {
          --bg: #07111f;
          --bg-soft: #0d1b2a;
          --panel: rgba(15, 23, 42, 0.85);
          --panel-strong: #101f35;
          --line: rgba(96, 165, 250, 0.25);
          --primary: #7dd3fc;
          --green: #34d399;
          --amber: #fbbf24;
          --red: #fb7185;
          --text: #e2e8f0;
          --muted: #94a3b8;
          --shadow: 0 20px 40px rgba(14, 116, 144, 0.28);
        }

        * { box-sizing: border-box; }

        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background:
            radial-gradient(circle at top, rgba(56, 189, 248, 0.18), transparent 30%),
            linear-gradient(135deg, var(--bg), #0a1424 50%, #091421);
          color: var(--text);
          min-height: 100vh;
        }

        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 32px 20px 60px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 16px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .brand-badge {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: var(--green);
          box-shadow: 0 0 16px var(--green);
        }

        h1 {
          margin: 0;
          font-size: 1.8rem;
          color: #f8fafc;
        }

        .status-pill {
          background: rgba(52, 211, 153, 0.12);
          color: var(--green);
          border: 1px solid rgba(52, 211, 153, 0.35);
          border-radius: 999px;
          padding: 8px 14px;
          font-size: 0.9rem;
          font-weight: bold;
          letter-spacing: 0.04em;
        }

        .grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 22px;
          margin-top: 24px;
        }

        .panel {
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--line);
          border-radius: 18px;
          box-shadow: var(--shadow);
          overflow: hidden;
        }

        .panel-header {
          padding: 18px 20px;
          border-bottom: 1px solid var(--line);
          background: rgba(15, 118, 110, 0.08);
        }

        .panel-header h2 {
          margin: 0;
          font-size: 1.05rem;
          color: var(--primary);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .edu-content {
          padding: 20px;
        }

        .flow {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 18px;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 14px;
          padding: 14px 16px;
          border-radius: 12px;
          background: rgba(15, 118, 110, 0.06);
          border: 1px solid var(--line);
        }

        .step-number {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), #38bdf8);
          color: #062437;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .step h3 {
          margin: 0 0 4px;
          font-size: 0.95rem;
          color: #f8fafc;
        }

        .step p {
          margin: 0;
          color: var(--muted);
          line-height: 1.5;
          font-size: 0.9rem;
        }

        .info-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: grid;
          gap: 10px;
        }

        .info-list li {
          padding: 10px 12px;
          border-radius: 10px;
          background: rgba(15, 23, 42, 0.8);
          border: 1px solid var(--line);
          color: var(--text);
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
          padding: 20px;
        }

        .stat-card {
          background: rgba(15, 23, 42, 0.9);
          border: 1px solid var(--line);
          border-radius: 12px;
          padding: 18px;
        }

        .stat-card .label {
          display: block;
          color: var(--muted);
          font-size: 0.72rem;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: 8px;
        }

        .stat-card .value {
          display: block;
          font-size: 1.5rem;
          font-weight: bold;
          color: #f8fafc;
        }

        .table-wrap {
          padding: 0 20px 20px;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 6px;
        }

        th, td {
          padding: 12px 14px;
          text-align: left;
          border-bottom: 1px solid var(--line);
          color: var(--text);
        }

        th {
          width: 230px;
          color: var(--primary);
          font-weight: 600;
          background: rgba(125, 211, 252, 0.04);
        }

        td {
          color: #dfeaf5;
        }

        @media (max-width: 900px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .node {
            transform: scale(0.9);
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="brand">
            <div class="brand-badge"></div>
            <h1>Infraestrutura AWS / Rede</h1>
          </div>
          <div class="status-pill">ONLINE</div>
        </div>

        <div class="grid">
          <div class="panel">
            <div class="panel-header">
              <h2>Como o ambiente funciona</h2>
            </div>
            <div class="edu-content">
              <div class="flow">
                <div class="step">
                  <div class="step-number">1</div>
                  <div>
                    <h3>Cliente</h3>
                    <p>Um usuário ou outra aplicação acessa a aplicação por rede, normalmente usando um IP ou domínio.</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">2</div>
                  <div>
                    <h3>Servidor</h3>
                    <p>Este host recebe a requisição e executa o processo da aplicação em Node.js.</p>
                  </div>
                </div>
                <div class="step">
                  <div class="step-number">3</div>
                  <div>
                    <h3>Recursos do sistema</h3>
                    <p>CPU, memória, uptime e rede mostram se o ambiente está saudável e estável para servir a aplicação.</p>
                  </div>
                </div>
              </div>

              <ul class="info-list">
                <li><strong>IP detectado:</strong> ${info.server.ipAddresses.join(', ') || 'N/A'}</li>
                <li><strong>Ambiente:</strong> ${info.environment.nodeEnv}</li>
                <li><strong>Porta da aplicação:</strong> ${info.environment.port}</li>
              </ul>
            </div>
          </div>

          <div class="panel">
            <div class="panel-header">
              <h2>Resumo do Host</h2>
            </div>
            <div class="stats">
              <div class="stat-card">
                <span class="label">CPU</span>
                <span class="value">${info.server.cpuCount}</span>
              </div>
              <div class="stat-card">
                <span class="label">Memória</span>
                <span class="value">${info.server.totalMemoryMb} MB</span>
              </div>
              <div class="stat-card">
                <span class="label">Uptime</span>
                <span class="value">${info.server.uptimeSeconds}s</span>
              </div>
              <div class="stat-card">
                <span class="label">PID</span>
                <span class="value">${info.process.pid}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="panel" style="margin-top: 24px;">
          <div class="panel-header">
            <h2>Detalhes do servidor</h2>
          </div>
          <div class="table-wrap">
            <table>
              ${tableHtml}
            </table>
          </div>
        </div>
      </div>
    </body>
    </html>`;
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const info = getServerInfo();

  if (url.pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', timestamp: info.timestamp }, null, 2));
    return;
  }

  if (url.pathname === '/api/info') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(info, null, 2));
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(renderHtml(info));
});

server.listen(port, () => {
  console.log(`Aplicação rodando em http://localhost:${port}`);
  console.log(`Informações do servidor em http://localhost:${port}/api/info`);
});
