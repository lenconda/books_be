export class StatusMessage {
  private target: string;

  constructor(target: string) {
    this.target = target;
  }

  public create(status: boolean, extra?: string) {
    return `创建${this.target}${status ? '成功' : '失败'}${extra ? `，${extra}` : ''}`;
  }

  public edit(status: boolean, extra?: string) {
    return `更新${this.target}${status ? '成功' : '失败'}${extra ? `，${extra}` : ''}`;
  }

  public delete(status: boolean, extra?: string) {
    return `删除${this.target}${status ? '成功' : '失败'}${extra ? `，${extra}` : ''}`;
  }

  public query(status: boolean, extra?: string) {
    return `查询${this.target}${status ? '成功' : '失败'}${extra ? `，${extra}` : ''}`;
  }

  public action(status: boolean, extra?: string) {
    return `${this.target}${status ? '成功' : '失败'}${extra ? `，${extra}` : ''}`;
  }
}
