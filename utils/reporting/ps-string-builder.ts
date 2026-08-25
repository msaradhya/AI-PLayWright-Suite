/**
 * PowerSchool String Builder utility for building formatted text
 * Used for constructing report messages and logs
 */
export class PSStringBuilder {
    private _text: string = '';
    private _appendedCount: number = 0;

    append(text: string): PSStringBuilder {
        this._text += text;
        this._appendedCount++;
        return this;
    }

    return(): PSStringBuilder {
        this._text += '\n';
        return this;
    }

    get text(): string {
        return this._text;
    }

    get appendedCount(): number {
        return this._appendedCount;
    }

    clear(): PSStringBuilder {
        this._text = '';
        this._appendedCount = 0;
        return this;
    }
}