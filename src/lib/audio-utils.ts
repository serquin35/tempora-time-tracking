/**
 * Utilidad para generar sonidos sintéticos simples para notificaciones
 * Esto evita la dependencia de archivos de audio externos.
 */

class AudioService {
    private context: AudioContext | null = null;

    private initContext() {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
    }

    /**
     * Tono sutil para avisos regulares (ej. cada 15 min parado)
     */
    async playReminder() {
        try {
            this.initContext();
            if (!this.context) return;

            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(440, this.context.currentTime); // La
            osc.frequency.exponentialRampToValueAtTime(880, this.context.currentTime + 0.1);

            gain.gain.setValueAtTime(0, this.context.currentTime);
            gain.gain.linearRampToValueAtTime(0.1, this.context.currentTime + 0.05);
            gain.gain.linearRampToValueAtTime(0, this.context.currentTime + 0.3);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start();
            osc.stop(this.context.currentTime + 0.3);
        } catch (e) {
            console.warn("Audio play blocked by browser policy", e);
        }
    }

    /**
     * Tono para marcar la hora o media hora
     */
    async playClockChime() {
        try {
            this.initContext();
            if (!this.context) return;

            const osc = this.context.createOscillator();
            const gain = this.context.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(523.25, this.context.currentTime); // Do5

            gain.gain.setValueAtTime(0, this.context.currentTime);
            gain.gain.linearRampToValueAtTime(0.15, this.context.currentTime + 0.1);
            gain.gain.exponentialRampToValueAtTime(0.001, this.context.currentTime + 1);

            osc.connect(gain);
            gain.connect(this.context.destination);

            osc.start();
            osc.stop(this.context.currentTime + 1);
        } catch (e) {
            console.warn("Audio play blocked by browser policy", e);
        }
    }
}

export const audioService = new AudioService();
