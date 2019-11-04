export type KeepaliveBeacon = (() => void)
export type KeepaliveCallback = (beacon: KeepaliveBeacon, keepalive?: Keepalive) => Promise<any>

export class KeepaliveTimeout extends Error {}

export class Keepalive {
  interval = 1000
  timeout = 10 * 1000
  timeoutMessage = 'timeout'

  constructor(options?: Partial<Keepalive>) {
    if (options) Object.assign(this, options)
    if (this.interval > this.timeout) this.interval = this.timeout
  }

  async watch(callback: KeepaliveCallback): Promise<any> {
    let alive = new Date()
    const beacon = () => {
      alive = new Date()
    }

    return new Promise(async (resolve, reject) => {
      const timer = setInterval(() => {
        if (+new Date() - +alive > this.timeout) {
          clearInterval(timer)
          reject(new KeepaliveTimeout(this.timeoutMessage))
        }
      }, this.interval)

      try {
        const result = await callback(beacon, this)
        resolve(result)
      } catch (ex) {
        reject(ex)
      } finally {
        clearInterval(timer)
      }
    })
  }
}

export function setKeepalive(cb: KeepaliveCallback, options?: Partial<Keepalive>|number): Promise<any> {
  const opts = options instanceof Object ? options : { timeout: options }
  const keepalive = new Keepalive(opts)
  return keepalive.watch(cb)
}

