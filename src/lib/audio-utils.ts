/**
 * AudioService refinado para notificaciones de alta calidad.
 * Utiliza síntesis aditiva y envolventes suaves para un sonido premium.
 */

class AudioService {
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;

    private initContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
            this.masterGain.gain.value = 0.5; // Volumen maestro cómodo
        }
    }

    /**
     * Crea un sonido armónico con múltiples frecuencias.
     */
    private async playNote(freq: number, type: OscillatorType, duration: number, volume: number = 0.1) {
        this.initContext();
        if (!this.context || !this.masterGain) return;

        const now = this.context.currentTime;
        const osc = this.context.createOscillator();
        const gain = this.context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, now);

        // Envolvente ADSR simple
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc.stop(now + duration);
    }

    /**
     * Tono sutil pero nítido para avisar que el contador está parado.
     * Acorde de recordatorio.
     */
    async playReminder() {
        try {
            await this.playNote(440, 'sine', 0.5, 0.15); // La
            await this.playNote(554.37, 'sine', 0.5, 0.1); // Do# (Tercera mayor)
        } catch (e) {
            console.warn("Audio blocked", e);
        }
    }

    /**
     * Campana armónica clara para la hora / media hora.
     */
    async playClockChime() {
        try {
            const now = this.context?.currentTime || 0;
            // Campana de cristal (frecuencias altas + armónicos)
            this.playNote(1046.50, 'triangle', 1.5, 0.2); // Do6
            this.playNote(2093, 'sine', 0.8, 0.05); // Octava
            this.playNote(523.25, 'sine', 2.0, 0.1); // Do5 (Sustain)
        } catch (e) {
            console.warn("Audio blocked", e);
        }
    }

    /**
     * Sonido de éxito al finalizar una sesión productiva.
     */
    async playSuccess() {
        try {
            this.playNote(523.25, 'sine', 0.1, 0.1);
            setTimeout(() => this.playNote(659.25, 'sine', 0.1, 0.1), 100);
            setTimeout(() => this.playNote(783.99, 'sine', 0.4, 0.15), 200);
        } catch (e) {
            console.warn("Audio blocked", e);
        }
    }
}

export const audioService = new AudioService();
