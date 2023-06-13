import axios, { AxiosResponse } from 'axios';

export class Server {
    url: string;
    routes: string[];
    cpu: number;
    status: 'GOOD' | 'DOWN' | 'POOR';
    message: string;
    requestInProgress: boolean;

    constructor(url: string, routes: string[]) {
        this.url = url;
        this.routes = routes;
        this.cpu = 0;
        this.status = 'DOWN'; // UP | DOWN | POOR
        this.message = '';
        this.requestInProgress = false;

        // The POOR status is set when the request takes more than 5 seconds. We don't know if the server is down or not for the moment.
        // The DOWN status is set when the request returns an error (!= 200).
    }

    async updateCPU(maxWaitTime: number): Promise<void> {
        if (this.requestInProgress) return;

        this.requestInProgress = true;

        const timeoutPromise = new Promise<{ timeout: boolean }>((resolve) => {
            setTimeout(() => {
                resolve({ timeout: true });
            }, maxWaitTime); // Timeout set to 5 seconds
        });
        const fetchPromise = axios.get(this.url + '/getCPU')
            .then((response: AxiosResponse) => {
                if (response.status !== 200) {
                    this.status = 'DOWN';
                    this.message = 'La réponse n\'est pas arrivée (504)';
                } else {
                    return response.data;
                }
            })
            .then((data: any) => {
                if (data && data.cpu) {
                    this.cpu = data.cpu;
                    this.status = 'GOOD';
                    this.message = '';
                }
            })
            .catch((error: any) => {
                this.status = 'DOWN';
                this.message = error.message;
            })
            .finally(() => {
                this.requestInProgress = false;
            });

        const result = await Promise.race([timeoutPromise, fetchPromise]);

        if (result && typeof result.timeout === 'boolean' && this.status !== 'DOWN') {
            this.status = 'POOR';
        }
    }

    getRoutes(): string[] {
        return this.routes;
    }

    getPrint(): string {
        return `SERVER || URL: ${this.url.split('/')[2]} || routes: ${this.routes.length} || CPU: ${this.cpu.toFixed(2)} || REQUEST: ${this.requestInProgress ? '⏳' : '✅'
            } || STATUS: ${this.status
            } ${this.status === 'GOOD' ? '✅' : this.status === 'POOR' ? '⚠️' : '❌'} ${this.message ? ' -> ' + this.message : ''
            } \n`;
    }
}

export default Server;
