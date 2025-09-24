import os
import io
import pandas as pd
import matplotlib.pyplot as plt
from flask import Flask, request, jsonify, send_file, render_template
from filelock import FileLock
from datetime import datetime

app = Flask(__name__)

BASE_DIR = os.path.join(os.path.dirname(__file__), "data")
os.makedirs(BASE_DIR, exist_ok=True)

DATA_PATH = os.path.join(BASE_DIR, "datos.csv")
LOCK_PATH = os.path.join(BASE_DIR, "datos.lock")

# Crear archivo CSV vacío si no existe
if not os.path.exists(DATA_PATH):
    df = pd.DataFrame(columns=["tiempo","nombre","apellido","escuela","transporte","comentario"])
    df.to_csv(DATA_PATH, index=False, sep=";", encoding="utf-8")

# ========================= API ==============================

@app.route('/api/data', methods=['GET'])
def get_data():
    df = pd.read_csv(DATA_PATH, sep=";", encoding="utf-8")
    conteo = df['transporte'].value_counts(dropna=True).to_dict()
    total = int(len(df))
    return jsonify({'total': total, 'counts': conteo})


@app.route('/api/submit', methods=['POST'])
def submit():
    payload = request.json
    row = {
        'tiempo': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        'nombre': payload.get('nombre',''),
        'apellido': payload.get('apellido',''),
        'escuela': payload.get('escuela',''),
        'transporte': payload.get('transporte',''),
        'comentario': payload.get('comentario','')
    }

    lock = FileLock(LOCK_PATH)
    with lock:
        try:
            df = pd.read_csv(DATA_PATH, sep=";", encoding="utf-8")
        except FileNotFoundError:
            df = pd.DataFrame(columns=row.keys())
        df = pd.concat([df, pd.DataFrame([row])], ignore_index=True)
        df.to_csv(DATA_PATH, index=False, sep=";", encoding="utf-8")

    return jsonify({'status': 'ok'})


@app.route('/api/export', methods=['GET'])
def export_csv():
    if not os.path.exists(DATA_PATH):
        df = pd.DataFrame(columns=["tiempo","nombre","apellido","escuela","transporte","comentario"])
    else:
        df = pd.read_csv(DATA_PATH, sep=";", encoding="utf-8")

    buf = io.StringIO()
    df.to_csv(buf, index=False, sep=";", encoding="utf-8")
    buf.seek(0)
    return send_file(
        io.BytesIO(buf.getvalue().encode("utf-8")),
        mimetype="text/csv",
        download_name="respuestas_export.csv",
        as_attachment=True
    )


@app.route('/api/chart/pie.png', methods=['GET'])
def pie_chart():
    df = pd.read_csv(DATA_PATH, sep=";", encoding="utf-8")
    counts = df['transporte'].value_counts()
    fig, ax = plt.subplots()
    ax.pie(counts.values, labels=counts.index, autopct='%1.1f%%')
    ax.set_title('Preferencia de transporte')
    buf = io.BytesIO()
    fig.savefig(buf, format='png', bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return send_file(buf, mimetype='image/png')

# ========================= FRONTEND ==============================

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))












